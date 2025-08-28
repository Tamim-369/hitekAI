import { Context, Hono } from "hono";
import { handleCustomerRequest } from "./controller";

const customerRoutes = new Hono();
customerRoutes.get("/", (c: Context) => c.text("Customer AI Root"));
customerRoutes.post("/ask", handleCustomerRequest);
export default customerRoutes;
