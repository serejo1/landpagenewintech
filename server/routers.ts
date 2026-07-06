import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLead, getAllLeads, sendLeadToGoogleSheets } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          phone: z.string().min(10, "Telefone inválido"),
          email: z.string().email("Email inválido"),
          city: z.string().min(1, "Cidade é obrigatória"),
          unit: z.string().min(1, "Unidade é obrigatória"),
          area: z.string().min(1, "Área é obrigatória"),
          course: z.string().optional(),
          source: z.string().default("landing_page"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Save to database
          const result = await createLead(input);
          
          // Send to Google Sheets
          const sheetsSuccess = await sendLeadToGoogleSheets(input);
          
          return {
            success: true,
            message: "Lead salvo com sucesso!",
            data: result,
            sheetsSync: sheetsSuccess,
          };
        } catch (error) {
          console.error("Error creating lead:", error);
          return {
            success: false,
            message: "Erro ao salvar lead. Tente novamente.",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    list: publicProcedure.query(async () => {
      const leads = await getAllLeads();
      return {
        success: true,
        data: leads,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
