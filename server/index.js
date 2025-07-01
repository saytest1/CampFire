import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
// import { useGraphQLMiddleware } from "@envelop/graphql-middleware";
// import { permissions } from "./permissions.js";
import { db } from "./config.js";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { initDatabase } from "./data/init.js";
await initDatabase();

const app = express();

app.use('/img', express.static(path.join(__dirname, 'img')));

const yoga = createYoga({ 
    schema,
    graphqlEndpoint: "/",
    // plugins: [useGraphQLMiddleware([permissions])],
    context: async ({ request }) => {
        return {
          db: db,
          secret: request.headers.get("secret") ?? "",
        };
      },
});
const server = createServer(yoga);

app.get("/img/:filename", (req, res) => {
  const filename = req.params.filename;
  const pathDir = path.join(__dirname, "/img/" + filename);

  // TODO: kiểm tra file tồn tại hay không
  res.sendFile(pathDir);
});

app.use(yoga.graphqlEndpoint, yoga);



const PORT = 4000; // process.env.PORT
server.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});