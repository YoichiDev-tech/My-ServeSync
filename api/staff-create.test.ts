import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const getUserFromAuthHeaderMock = vi.fn();
const insertMock = vi.fn();

vi.mock("./_lib/supabaseAdmin", () => ({
  getUserFromAuthHeader: getUserFromAuthHeaderMock,
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({ insert: insertMock })),
  })),
}));

const { app } = await import("./staff-create");

beforeEach(() => {
  getUserFromAuthHeaderMock.mockReset();
  insertMock.mockReset();
  getUserFromAuthHeaderMock.mockResolvedValue({ id: "verified-user", email: "owner@example.com" });
  insertMock.mockResolvedValue({ error: null });
});

describe("POST /api/staff-create authentication", () => {
  it("rejects a request that only supplies a spoofable x-user-id header", async () => {
    getUserFromAuthHeaderMock.mockResolvedValueOnce(null);
    const response = await request(app)
      .post("/api/staff-create")
      .set("x-user-id", "victim-user")
      .send({ name: "Alex", role: "Server", hourly_rate: 15, max_weekly_hours: 30 });

    expect(response.status).toBe(401);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("associates the inserted staff record with the verified token user", async () => {
    const response = await request(app)
      .post("/api/staff-create")
      .set("Authorization", "Bearer valid-token")
      .set("x-user-id", "attacker-selected-user")
      .send({ name: "Alex", role: "Server", hourly_rate: 15, max_weekly_hours: 30 });

    expect(response.status).toBe(201);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      user_id: "verified-user",
      name: "Alex",
      role: "Server",
    }));
  });
});
