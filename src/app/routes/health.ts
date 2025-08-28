import { Context, Hono } from "hono";
const health = new Hono();
health.get("/", (c: Context) => c.text("OK"));
export default health;
