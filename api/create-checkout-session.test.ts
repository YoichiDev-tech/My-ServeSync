import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const getUserMock = vi.fn();
const createSessionMock = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      auth: { getUser: getUserMock },
    })),
  };
});

vi.mock("stripe", () => {
  class MockStripe {
    checkout = { sessions: { create: createSessionMock } };
  }
  return { default: MockStripe };
});

const { app } = await import("./create-checkout-session");

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test_service_role_key",
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_PRICE_ID: "price_123",
    PUBLIC_SITE_URL: "https://servesync.test",
  };

  getUserMock.mockReset();
  createSessionMock.mockReset();

  getUserMock.mockResolvedValue({
    data: { user: { id: "user-1", email: "jamie@example.com" } },
    error: null,
  });
  createSessionMock.mockResolvedValue({ url: "https://checkout.stripe.com/session/abc" });
});

function post(body: unknown, token?: string) {
  const req = request(app).post("/api/create-checkout-session");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return req.send(body as object);
}

describe("validation", () => {
  it("rejects an unknown intent", async () => {
    const res = await post({ intent: "renew" });
    expect(res.status).toBe(400);
  });

  it("returns 500 when STRIPE_PRICE_ID is not configured", async () => {
    delete process.env.STRIPE_PRICE_ID;
    const res = await post({ intent: "new" });
    expect(res.status).toBe(500);
  });
});

describe("new signup checkout", () => {
  it("creates a guest checkout session and returns its url", async () => {
    const res = await post({ intent: "new", email: "jamie@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.url).toBe("https://checkout.stripe.com/session/abc");

    const args = createSessionMock.mock.calls[0][0];
    expect(args.success_url).toContain("/register?plan=premium");
    expect(args.customer_email).toBe("jamie@example.com");
  });

  it("does not require authentication", async () => {
    const res = await post({ intent: "new" });
    expect(res.status).toBe(200);
    expect(getUserMock).not.toHaveBeenCalled();
  });
});

describe("upgrade checkout", () => {
  it("requires authentication", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: { message: "bad token" } });
    const res = await post({ intent: "upgrade" }, "bad-token");
    expect(res.status).toBe(401);
  });

  it("uses the authenticated user's own email, ignoring any email in the body", async () => {
    const res = await post({ intent: "upgrade", email: "attacker@example.com" }, "good-token");
    expect(res.status).toBe(200);

    const args = createSessionMock.mock.calls[0][0];
    expect(args.customer_email).toBe("jamie@example.com");
    expect(args.success_url).toContain("/dashboard?upgraded=1");
  });
});