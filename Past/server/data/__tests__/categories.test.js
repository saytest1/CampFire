import mongoose from "mongoose";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { db } from "../mongoRepo.js";
import { Category } from "../models/index.js";

const sampleCategories = [
  { name: "Lều" },
  { name: "Kìm" },
  { name: "Giày" },
  { name: "Dây" },
];

let createdSampleCategories = [];

beforeEach(async () => {
  await Category.deleteMany({});
  createdSampleCategories = [];

  for (const category of sampleCategories) {
    const createdCategory = new Category(category);
    createdSampleCategories.push(await createdCategory.save());
  }
});

describe("creating category", () => {
  test("with all parameters should succeed", async () => {
    const newItem = { name: "Dây" };
    const createdItem = await db.categories.create(newItem);

    expect(createdItem._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const foundItem = await db.categories.findById(createdItem._id);
    expect(foundItem).toEqual(expect.objectContaining(newItem));
  });
});

describe("listing categories", () => {
  test("should return all categories", async () => {
    const items = await db.categories.getAll();
    expect(items.length).toEqual(createdSampleCategories.length);
  });
});
