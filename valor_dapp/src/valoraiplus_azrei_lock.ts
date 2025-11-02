import type { Router as TRouter, Request, Response } from "express";
import express from "express";

type Opts = {
  valoraiplus_module_id: string;
  valoraiplus_GILLBTC: string;
  namespace?: string;
  phbiUrl?: string;
};

export function valoraiplus_createAzreiRouter(opts: Opts): TRouter {
  const router = express.Router();

  router.use((req, res, next) => {
    // This is a placeholder for the middleware that would set the
    // __valoraiplus_azrei context. In a real application, this would
    // be a more complex piece of logic that would likely be shared
    // with the violation router.
    if (req.query.notified === "true") {
      (req as any).__valoraiplus_azrei = { notified: true };
    }
    next();
  });

  router.get("/valoraiplus/azrei-lock", (req, res) => {
    const ctx = (req as any).__valoraiplus_azrei || {};
    const head = ctx.notified ? "FEDERAL AUTHORITIES NOTIFIED" : "SECURITY INCIDENT RECORDED";
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VALORAIPLUS_AZREILOCK :: ${head}</title>
          <style>
            body { font-family: monospace; background: #000; color: #f00; text-align: center; padding-top: 100px; }
            h1 { font-size: 2em; }
          </style>
        </head>
        <body>
          <h1>VALORAIPLUS_AZREILOCK :: ${head}</h1>
        </body>
      </html>
    `);
  });

  return router;
}
