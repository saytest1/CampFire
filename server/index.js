import express from "express";
import cors from "cors";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";
import { permissions } from "./permissions.js";
import { db } from "./config.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { initDatabase } from "./data/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

await initDatabase();
const signingKey = process.env.JWT_SECRET;
const app = express();

app.use(cors({
  origin: '*', 
  credentials: true,
  allowedHeaders: ["X-Custom-Header", "content-type", "authorization"],
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use('/img', express.static(path.join(__dirname, 'img')));

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/",
  plugins: [useGraphQLMiddleware([permissions])],
  context: async ({ request }) => {
    const authorization = request.headers.get("authorization") ?? "";
    let user = null;
    if (authorization.startsWith("Bearer")) {
      const token = authorization.substring(7);
      try {
        user = jwt.verify(token, signingKey);
      } catch (e) {
        user = null;
      }
    }

    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }

    return {
      db,
      user,
      headers
    };
  }
});

app.use(yoga.graphqlEndpoint, yoga);
app.get("/img/:filename", (req, res) => {
  const filename = req.params.filename;
  const pathDir = path.join(__dirname, "/img/" + filename);
  res.sendFile(pathDir);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});