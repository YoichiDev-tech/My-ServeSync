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
    STRIPE_PRICE_ID_COUNTER: "price_counter_123",
    STRIPE_PRICE_ID_KITCHEN: "price_kitchen_456",
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
    const res = await post({ intent: "renew", plan: "counter" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing plan", async () => {
    const res = await post({ intent: "new" });
    expect(res.status).toBe(400);
  });

  it("rejects an unknown plan", async () => {
    const res = await post({ intent: "new", plan: "deluxe" });
    expect(res.status).toBe(400);
  });

  it("returns 500 when the selected plan's price id is not configured", async () => {
    delete process.env.STRIPE_PRICE_ID_COUNTER;
    const res = await post({ intent: "new", plan: "counter" });
    expect(res.status).toBe(500);
  });
});

describe("new signup checkout", () => {
  it("creates a guest checkout session on the Counter plan and returns its url", async () => {
    const res = await post({ intent: "new", plan: "counter", email: "jamie@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.url).toBe("https://checkout.stripe.com/session/abc");

    const args = createSessionMock.mock.calls[0][0];
    expect(args.line_items[0].price).toBe("price_counter_123");
    expect(args.success_url).toContain("/register?plan=counter");
    expect(args.customer_email).toBe("jamie@example.com");
  });

  it("creates a guest checkout session on the Kitchen plan using its own price id", async () => {
    const res = await post({ intent: "new", plan: "kitchen" });
    expect(res.status).toBe(200);

    const args = createSessionMock.mock.calls[0][0];
    expect(args.line_items[0].price).toBe("price_kitchen_456");
    expect(args.success_url).toContain("/register?plan=kitchen");
  });

  it("does not require authentication", async () => {
    const res = await post({ intent: "new", plan: "counter" });
    expect(res.status).toBe(200);
    expect(getUserMock).not.toHaveBeenCalled();
  });
});

describe("upgrade checkout", () => {
  it("requires authentication", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: { message: "bad token" } });
    const res = await post({ intent: "upgrade", plan: "counter" }, "bad-token");
    expect(res.status).toBe(401);
  });

  it("uses the authenticated user's own email, ignoring any email in the body", async () => {
    const res = await post(
      { intent: "upgrade", plan: "kitchen", email: "attacker@example.com" },
      "good-token"
    );
    expect(res.status).toBe(200);

    const args = createSessionMock.mock.calls[0][0];
    expect(args.line_items[0].price).toBe("price_kitchen_456");
    expect(args.customer_email).toBe("jamie@example.com");
    expect(args.success_url).toContain("/dashboard?upgraded=1");
  });
});