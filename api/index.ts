import app from "../src/app/index";
import { handle } from "hono/vercel";

// Use Node.js runtime to support MongoDB driver (version pinned in vercel.json)
export const config = {
  runtime: "nodejs",
};

export default handle(app);
