import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";
import { permissions } from "./permissions.js";
import { db } from "./config.js";

import dotenv from "dotenv";
dotenv.config();

import {initDatabase} from "./data/init.js"
await initDatabase();

const mockData = {
  categories: [
    { id: 1, name: "Lều" },
    { id: 2, name: "Kìm" },
    { id: 3, name: "Giày" },
    { id: 4, name: "Dây" },
  ],
};

const mockDb = {
  categories: {
    getAll: () => mockData.categories,
    findById: (id) => mockData.categories.find((item) => item.id == id),
  },
};

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/",
  plugins: [useGraphQLMiddleware([permissions])],
  context: async ({ request }) => {
    return {
      db: db,
      secret: request.headers.get("secret") ?? "",
    };
  },
});
const server = createServer(yoga);

const PORT = 4000; // process.env.PORT
server.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});