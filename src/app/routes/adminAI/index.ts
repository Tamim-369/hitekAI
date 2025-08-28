import { Hono } from "hono";
import { adminChatController, adminStatusController } from "./controller";

const adminRoutes = new Hono();

// Admin AI chat endpoint
adminRoutes.post("/chat", adminChatController);

// Admin service status endpoint
adminRoutes.get("/status", adminStatusController);

export default adminRoutes;
