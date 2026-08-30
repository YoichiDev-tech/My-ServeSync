import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const getUserMock = vi.fn();
const singleMock = vi.fn();
const deleteUserMock = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      auth: {
        getUser: getUserMock,
        admin: { deleteUser: deleteUserMock },
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ single: singleMock })),
        })),
      })),
    })),
  };
});

const { app } = await import("./trial-cleanup");

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test_service_role_key",
  };

  getUserMock.mockReset();
  singleMock.mockReset();
  deleteUserMock.mockReset();

  getUserMock.mockResolvedValue({
    data: { user: { id: "user-1", email: "jamie@example.com" } },
    error: null,
  });
  deleteUserMock.mockResolvedValue({ error: null });
});

function post(token: string | null = "valid-token") {
  const req = request(app).post("/api/trial-cleanup");
  if (token) req.set("Authorization", `Bearer ${token}`);
  return req.send();
}

it("rejects requests with no auth", async () => {
  const res = await post(null);
  expect(res.status).toBe(401);
});

it("returns 404 when the profile can't be found", async () => {
  singleMock.mockResolvedValueOnce({ data: null, error: { message: "not found" } });
  const res = await post();
  expect(res.status).toBe(404);
});

it("does not delete an active (premium) account, even with a past trial date", async () => {
  singleMock.mockResolvedValueOnce({
    data: { trial_ends_at: "2020-01-01T00:00:00.000Z", subscription_status: "active" },
    error: null,
  });
  const res = await post();
  expect(res.status).toBe(200);
  expect(res.body.deleted).toBe(false);
  expect(deleteUserMock).not.toHaveBeenCalled();
});

it("does not delete an account whose trial hasn't ended yet", async () => {
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  singleMock.mockResolvedValueOnce({
    data: { trial_ends_at: future, subscription_status: "trialing" },
    error: null,
  });
  const res = await post();
  expect(res.status).toBe(200);
  expect(res.body.deleted).toBe(false);
  expect(deleteUserMock).not.toHaveBeenCalled();
});

it("deletes an account whose trial has ended", async () => {
  const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  singleMock.mockResolvedValueOnce({
    data: { trial_ends_at: past, subscription_status: "trialing" },
    error: null,
  });
  const res = await post();
  expect(res.status).toBe(200);
  expect(res.body.deleted).toBe(true);
  expect(deleteUserMock).toHaveBeenCalledWith("user-1");
});

it("only ever deletes the authenticated caller's own account", async () => {
  const past = new Date(Date.now() - 1000).toISOString();
  singleMock.mockResolvedValueOnce({
    data: { trial_ends_at: past, subscription_status: "trialing" },
    error: null,
  });
  await post();
  expect(deleteUserMock).toHaveBeenCalledTimes(1);
  expect(deleteUserMock).toHaveBeenCalledWith("user-1");
});