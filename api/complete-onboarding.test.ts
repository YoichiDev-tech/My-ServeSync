import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const getUserMock = vi.fn();
const insertMock = vi.fn();
const profilesUpdateMock = vi.fn();
const updateEqMock = vi.fn();
const retrieveSessionMock = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      auth: { getUser: getUserMock },
      from: vi.fn((table: string) => {
        if (table === "trial_usage") {
          return { insert: insertMock };
        }
        // profiles
        return {
          update: (payload: unknown) => {
            profilesUpdateMock(payload);
            return { eq: updateEqMock };
          },
        };
      }),
    })),
  };
});

vi.mock("stripe", () => {
  class MockStripe {
    checkout = { sessions: { retrieve: retrieveSessionMock } };
  }
  return { default: MockStripe };
});

const { app } = await import("./complete-onboarding");

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test_service_role_key",
    STRIPE_SECRET_KEY: "sk_test_123",
  };

  getUserMock.mockReset();
  insertMock.mockReset();
  profilesUpdateMock.mockReset();
  updateEqMock.mockReset();
  retrieveSessionMock.mockReset();

  getUserMock.mockResolvedValue({
    data: { user: { id: "user-1", email: "jamie@example.com" } },
    error: null,
  });
  insertMock.mockResolvedValue({ error: null });
  updateEqMock.mockResolvedValue({ error: null });
});

function post(body: unknown, token: string | null = "valid-token") {
  const req = request(app).post("/api/complete-onboarding");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return req.send(body as object);
}

describe("auth", () => {
  it("rejects requests with no Authorization header", async () => {
    const res = await post({ plan: "trial" }, null);
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: { message: "bad token" } });
    const res = await post({ plan: "trial" });
    expect(res.status).toBe(401);
  });
});

describe("validation", () => {
  it("rejects an unknown plan", async () => {
    const res = await post({ plan: "gold" });
    expect(res.status).toBe(400);
  });
});

describe("trial plan", () => {
  it("activates a trial and returns trialEndsAt", async () => {
    const res = await post({ plan: "trial" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.trialEndsAt).toBeTruthy();
    expect(insertMock).toHaveBeenCalledWith([{ email: "jamie@example.com" }]);
  });

  it("sets trial_ends_at 14 days after trial_started_at", async () => {
    await post({ plan: "trial" });
    const payload = profilesUpdateMock.mock.calls[0][0];
    const start = new Date(payload.trial_started_at).getTime();
    const end = new Date(payload.trial_ends_at).getTime();
    expect(end - start).toBe(14 * 24 * 60 * 60 * 1000);
    expect(payload.subscription_status).toBe("trialing");
  });

  it("rejects a second trial for the same email with 409", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "23505", message: "duplicate key" } });
    const res = await post({ plan: "trial" });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("returns 500 on an unexpected trial_usage insert error", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "500", message: "db down" } });
    const res = await post({ plan: "trial" });
    expect(res.status).toBe(500);
  });
});

describe("premium plan", () => {
  it("requires a session_id", async () => {
    const res = await post({ plan: "premium" });
    expect(res.status).toBe(400);
  });

  it("activates premium when the Stripe session is paid and emails match", async () => {
    retrieveSessionMock.mockResolvedValueOnce({
      payment_status: "paid",
      status: "complete",
      customer_details: { email: "jamie@example.com" },
      customer: "cus_123",
      subscription: "sub_123",
    });

    const res = await post({ plan: "premium", session_id: "cs_test_123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects when the Stripe session isn't paid", async () => {
    retrieveSessionMock.mockResolvedValueOnce({
      payment_status: "unpaid",
      status: "open",
      customer_details: { email: "jamie@example.com" },
    });

    const res = await post({ plan: "premium", session_id: "cs_test_123" });
    expect(res.status).toBe(402);
  });

  it("rejects when the session email doesn't match the account email", async () => {
    retrieveSessionMock.mockResolvedValueOnce({
      payment_status: "paid",
      status: "complete",
      customer_details: { email: "someone-else@example.com" },
      customer: "cus_123",
      subscription: "sub_123",
    });

    const res = await post({ plan: "premium", session_id: "cs_test_123" });
    expect(res.status).toBe(403);
  });

  it("returns 400 when the Stripe session can't be retrieved", async () => {
    retrieveSessionMock.mockRejectedValueOnce(new Error("no such session"));
    const res = await post({ plan: "premium", session_id: "cs_bad" });
    expect(res.status).toBe(400);
  });
});