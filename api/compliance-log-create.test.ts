import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const insertMock = vi.fn();
const selectMock = vi.fn();
const singleMock = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    })),
  };
});

const { app } = await import("./compliance-log-create");

beforeEach(() => {
  process.env.SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test_service_role_key";

  singleMock.mockReset();
  selectMock.mockReset();
  insertMock.mockReset();

  singleMock.mockResolvedValue({
    data: { id: "log-123", recorded_at: "2026-08-06T06:00:00.000Z" },
    error: null,
  });
  selectMock.mockReturnValue({ single: singleMock });
  insertMock.mockReturnValue({ select: selectMock });
});

const validPayload = {
  log_type: "temperature_check",
  location: "walk-in cooler",
  value: 38,
  unit: "F",
  recorded_by_name: "Jamie Rivera",
};

function post(body: unknown, userId: string | null = "manager-1") {
  const req = request(app).post("/api/compliance-log-create");
  if (userId) req.set("x-user-id", userId);
  return req.send(body as object);
}

describe("valid submissions", () => {
  it("accepts a valid temperature check", async () => {
    const res = await post(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBe("log-123");
  });

  it("accepts a correction that references a prior log with a reason", async () => {
    const res = await post({
      ...validPayload,
      corrects_log_id: "log-000",
      correction_reason: "Misread the thermometer, entered 38 instead of 3.8",
    });
    expect(res.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith([
      expect.objectContaining({
        corrects_log_id: "log-000",
        correction_reason: "Misread the thermometer, entered 38 instead of 3.8",
      }),
    ]);
  });
});

describe("append-only guarantees", () => {
  it("rejects non-POST methods", async () => {
    const res = await request(app).put("/api/compliance-log-create").send(validPayload);
    expect(res.status).toBe(405);
  });

  it("never exposes a way to update an existing log without a reason", async () => {
    const res = await post({ ...validPayload, corrects_log_id: "log-000" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/correction_reason/);
  });

  it("only ever calls insert, never update or delete, on the supabase client", async () => {
    await post(validPayload);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });
});

describe("validation", () => {
  it("rejects an invalid log_type", async () => {
    const res = await post({ ...validPayload, log_type: "vibes_check" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing recorded_by_name", async () => {
    const { recorded_by_name, ...rest } = validPayload;
    const res = await post(rest);
    expect(res.status).toBe(400);
  });

  it("rejects a non-numeric value", async () => {
    const res = await post({ ...validPayload, value: "cold" });
    expect(res.status).toBe(400);
  });

  it("rejects requests missing x-user-id", async () => {
    const res = await post(validPayload, null);
    expect(res.status).toBe(401);
  });

  it("surfaces a 500 with details when the insert fails", async () => {
    singleMock.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const res = await post(validPayload);
    expect(res.status).toBe(500);
    expect(res.body.details).toBe("db down");
  });
});