import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const typeDef = `
    scalar File

    extend type Mutation {
      upload(file: File!): String!
    }
`;

export const resolvers = {
  Mutation: {
    upload: async (_, { file }) => {
      try {
        const fileArrayBuffer = await file.arrayBuffer();
        await fs.promises.writeFile(
          path.join(__dirname + "/../img/", uuidv4() + file.name),
          Buffer.from(fileArrayBuffer)
        );
      } catch (e) {
        console.log("Cannot save uploaded file, reason: " + e);
        return false;
      }
      return true; // return uuid
    },
  },
};
