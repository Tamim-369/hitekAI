import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import { connectDB } from "../../routes/db/mongo";

export const makeMongoTool = (collectionName: string) =>
  new DynamicStructuredTool({
    name: `query_${collectionName}`,
    description: `Query the ${collectionName} collection in MongoDB. Use this when you need data from ${collectionName}. Pass a MongoDB filter object and optional limit/sort parameters.`,
    schema: z.object({
      filter: z.record(z.string(), z.any()).default({}),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of documents to return"),
      sort: z
        .record(z.string(), z.number())
        .optional()
        .describe("Sort order: 1 for ascending, -1 for descending"),
    }),
    func: async (args: {
      filter: Record<string, any>;
      limit?: number;
      sort?: Record<string, number>;
    }) => {
      const { filter, limit, sort } = args;
      try {
        const db = await connectDB();
        let cursor = db.collection(collectionName).find(filter);

        if (sort) cursor = cursor.sort(sort);
        if (limit) cursor = cursor.limit(limit);

        const results = await cursor.toArray();

        return JSON.stringify(
          {
            collection: collectionName,
            count: results.length,
            data: results,
          },
          null,
          2
        );
      } catch (error: any) {
        return JSON.stringify({
          error: `Failed to query ${collectionName}: ${error.message}`,
          collection: collectionName,
        });
      }
    },
  });

export const mongoTools = [
  makeMongoTool("products"),
  makeMongoTool("orders"),
  makeMongoTool("visits"),
  makeMongoTool("users"),
  makeMongoTool("analytics"),
  makeMongoTool("inventory"),
];
