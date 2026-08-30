import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const eqMock = vi.fn();
const deleteUserMock = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      auth: { admin: { deleteUser: deleteUserMock } },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ lt: eqMock })),
        })),
      })),
    })),
  };
});

const { app } = await import("./cleanup-expired-trials");

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test_service_role_key",
    CRON_SECRET: "test_cron_secret",
  };

  eqMock.mockReset();
  deleteUserMock.mockReset();
  deleteUserMock.mockResolvedValue({ error: null });
});

function sweep(secret: string | null = "test_cron_secret") {
  const req = request(app).get("/api/cleanup-expired-trials");
  if (secret) req.set("Authorization", `Bearer ${secret}`);
  return req.send();
}

describe("authorization", () => {
  it("rejects requests without the cron secret", async () => {
    const res = await sweep(null);
    expect(res.status).toBe(401);
  });

  it("rejects requests with the wrong secret", async () => {
    const res = await sweep("wrong-secret");
    expect(res.status).toBe(401);
  });
});

describe("sweep behaviour", () => {
  it("deletes every profile past its trial_ends_at", async () => {
    eqMock.mockResolvedValueOnce({
      data: [{ id: "user-1" }, { id: "user-2" }],
      error: null,
    });

    const res = await sweep();
    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(2);
    expect(deleteUserMock).toHaveBeenCalledWith("user-1");
    expect(deleteUserMock).toHaveBeenCalledWith("user-2");
  });

  it("returns deleted: 0 when nothing has expired", async () => {
    eqMock.mockResolvedValueOnce({ data: [], error: null });
    const res = await sweep();
    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(0);
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("reports partial failure without crashing the sweep", async () => {
    eqMock.mockResolvedValueOnce({
      data: [{ id: "user-1" }, { id: "user-2" }],
      error: null,
    });
    deleteUserMock
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: { message: "auth error" } });

    const res = await sweep();
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.deleted).toBe(1);
    expect(res.body.failed).toBe(1);
  });

  it("returns 500 when the query itself fails", async () => {
    eqMock.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const res = await sweep();
    expect(res.status).toBe(500);
  });
});