import { Context } from "hono";
import { adminAIResponse } from "./service";

export const adminChatController = async (c: Context) => {
  try {
    const { prompt, history } = await c.req.json();
    console.log(prompt);
    console.log(history);

    // Validate request
    if (!prompt || typeof prompt !== "string") {
      return c.json(
        {
          success: false,
          error: "Prompt is required and must be a string",
        },
        400
      );
    }

    // Process the admin AI request
    const result = await adminAIResponse(prompt, history);

    return c.json(result);
  } catch (error: any) {
    console.error("Admin Controller Error:", error);
    return c.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      500
    );
  }
};

export const adminStatusController = (c: Context) => {
  return c.json({
    service: "Admin AI Service",
    status: "active",
    collections: [
      "products",
      "orders",
      "visits",
      "users",
      "analytics",
      "inventory",
    ],
    timestamp: new Date().toISOString(),
  });
};
