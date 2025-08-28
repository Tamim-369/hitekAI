import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/hitekbd";
const client = new MongoClient(uri);

let db: any;

export const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db(); // let MongoClient pick from URI
    console.log("✅ MongoDB connected with native driver");
  }
  return db;
};
