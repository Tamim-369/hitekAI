import { Hono } from "hono";
import adminRoutes from "./routes/adminAI/index";
import customerRoutes from "./routes/customerAI/index";
import healthRoutes from "./routes/health";
import { logger } from "./middleware/logger";
import { secureHeadersMiddleware } from "./middleware/secureHeaders";
import { csrfMiddleware } from "./middleware/csrf";
import { limiter } from "./middleware/rateLimiter";

const app = new Hono();

// ✅ Global Middlewares
app.use("*", secureHeadersMiddleware);
app.use("*", logger);
app.use("*", csrfMiddleware);
app.use("*", limiter);

// Root route for sanity check
app.get("/", (c) => c.json({
  name: "hitekAI API",
  status: "ok",
  routes: ["/health", "/admin", "/customer"]
}));

// ✅ Mount AI Routes
app.route("/admin", adminRoutes);
app.route("/customer", customerRoutes);

// Health route
app.route("/health", healthRoutes);

// Error handler
app.onError((err, c) => {
  console.error(`[${new Date().toISOString()}] App Error:`, err);
  return c.text("Internal Server Error", 500);
});

export default app;
