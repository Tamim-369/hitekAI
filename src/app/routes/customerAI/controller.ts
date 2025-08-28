import { Context } from "hono";

export const handleCustomerRequest = async (c: Context) => {
  return c.text("Customer AI Response");
};
