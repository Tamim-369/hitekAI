import { Context, Next } from "hono";

export const logger = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  console.log(
    `[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${
      c.res.status || 200
    } ${Date.now() - start}ms`
  );
};
