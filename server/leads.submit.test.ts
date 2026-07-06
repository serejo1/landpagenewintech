import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

describe("leads.submit", () => {
  it("should successfully submit a lead with valid data", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      name: "João Silva",
      phone: "85987654321",
      email: "joao@example.com",
      city: "Fortaleza",
      unit: "Castanheira",
      area: "Programação & TI",
      course: "Desenvolvimento Web",
      source: "landing_page",
    };

    const result = await caller.leads.submit(leadData);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Lead salvo com sucesso!");
    expect(result.data).toBeDefined();
  });

  it("should fail with invalid email", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const invalidLeadData = {
      name: "João Silva",
      phone: "85987654321",
      email: "invalid-email",
      city: "Fortaleza",
      unit: "Castanheira",
      area: "Programação & TI",
      course: "Desenvolvimento Web",
    };

    try {
      await caller.leads.submit(invalidLeadData as any);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should fail with missing required fields", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const incompleteLeadData = {
      name: "João Silva",
      email: "joao@example.com",
      // Missing phone, city, unit, area
    };

    try {
      await caller.leads.submit(incompleteLeadData as any);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle optional course field", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const leadDataWithoutCourse = {
      name: "Maria Santos",
      phone: "85987654321",
      email: "maria@example.com",
      city: "Fortaleza",
      unit: "Belém",
      area: "Design Gráfico",
      // course is optional
    };

    const result = await caller.leads.submit(leadDataWithoutCourse);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Lead salvo com sucesso!");
  });
});

describe("leads.list", () => {
  it("should return a list of leads", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
