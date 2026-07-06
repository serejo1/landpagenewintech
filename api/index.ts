// Entry point serverless para Vercel. Não usa app.listen — a Vercel gerencia
// o ciclo de vida da function. Reaproveita toda a lógica de server/_core,
// então leads.submit, leads.list e o webhook do Google Sheets continuam
// funcionando exatamente como antes, sem duplicar código.
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
