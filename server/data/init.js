import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

export async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error(
      "Missing DATABASE_URL env var; vui lòng cấu hình trong file .env"
    );
  }
  await mongoose.connect(DATABASE_URL);
  console.log(`Database is up and running at: ${DATABASE_URL}`);
}
