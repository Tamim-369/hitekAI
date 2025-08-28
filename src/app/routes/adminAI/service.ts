import { ChatGroq } from "@langchain/groq";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { mongoTools } from "../../utils/tools/mongoTools";

export const adminService = () => {
  return "Admin AI Service - Database-Connected Assistant";
};

export const adminAIResponse = async (prompt: string, history: string = "") => {
  try {
    console.log("Started process");
    // Initialize Groq model
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
    });

    // Create the system prompt template
    const systemPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an Admin AI Assistant with access to MongoDB database collections.
        
        Your primary role is to:
        1. Analyze admin queries and determine if database access is needed
        2. Use the appropriate MongoDB query tools to retrieve relevant data
        3. Provide clear, data-driven responses based on the database information
        4. Format responses in a professional, admin-friendly manner
        
        Available collections and their purposes:
        - products: Product catalog, inventory, pricing, specifications
        - orders: Customer orders, transactions, order history, payment status
        - visits: Website/app visit analytics, user behavior, page views
        - users: User accounts, profiles, authentication data, user preferences
        - analytics: Business metrics, performance data, conversion rates
        - inventory: Stock levels, warehouse data, supply chain information
        
        Guidelines:
        - Always query the database when the response requires specific data
        - Use appropriate MongoDB filters to get relevant information
        - Limit results appropriately (default 10-20 items unless more needed)
        - Sort data logically (newest first for time-based data)
        - Provide context and insights, not just raw data
        - If no data found, explain what was searched and suggest alternatives
        - Format responses clearly with headers, bullet points, or tables when appropriate
        
        Examples of queries that need database access:
        - "Show me recent orders"
        - "What are our top selling products?"
        - "How many users registered this month?"
        - "What's our current inventory status?"
        - "Show me website traffic analytics"
        
        Always respond as an admin assistant focused on providing actionable insights.`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    // Create the agent
    const agent = createToolCallingAgent({
      llm: model,
      tools: mongoTools,
      prompt: systemPrompt,
    });

    // Create the agent executor
    const agentExecutor = new AgentExecutor({
      agent,
      tools: mongoTools,
      verbose: process.env.NODE_ENV === "development",
    });

    // Parse chat history
    const chatHistory: BaseMessage[] = [];
    if (history) {
      try {
        const historyData = JSON.parse(history);
        if (Array.isArray(historyData)) {
          historyData.forEach((msg) => {
            if (msg.role === "user") {
              chatHistory.push(new HumanMessage(msg.content));
            } else if (msg.role === "assistant") {
              chatHistory.push(new AIMessage(msg.content));
            }
          });
        }
      } catch (error) {
        console.warn("Failed to parse chat history:", error);
      }
    }
    console.log("agent executer starting");
    // Execute the agent
    const result = await agentExecutor.invoke({
      input: prompt,
      chat_history: chatHistory,
    });

    return {
      success: true,
      response: result.output,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Admin AI Response Error:", error);
    return {
      success: false,
      response:
        "I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.",
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
