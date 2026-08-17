import { readFileSync } from "node:fs";
import path from "node:path";
import prisma from "../src/lib/prisma";

const DATA_DIR = process.env.SEED_DATA_DIR ?? path.join(__dirname, "seed-data");

type OId = string | { $oid: string };

const oid = (value: OId): string => (typeof value === "string" ? value : value.$oid);

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(path.join(DATA_DIR, fileName), "utf-8")) as T;

interface AreaJson {
  _id: { $oid: string };
  name: string;
}

interface CategoryJson {
  _id: { $oid: string };
  name: string;
}

interface IngredientJson {
  _id: string;
  name: string;
  desc?: string;
  img?: string;
}

interface UserJson {
  _id: { $oid: string };
  name: string;
  avatar: string | null;
  email: string;
  followers: OId[];
  following: OId[];
}

interface RecipeJson {
  _id: { $oid: string };
  title: string;
  category: string;
  owner: OId;
  area: string;
  instructions: string;
  description?: string;
  thumb?: string;
  time?: string;
  ingredients: { id: string; measure?: string }[];
  createdAt?: { $date: { $numberLong: string } };
  updatedAt?: { $date: { $numberLong: string } };
}

interface TestimonialJson {
  _id: { $oid: string };
  owner: OId;
  testimonial: string;
}

const toDate = (value?: { $date: { $numberLong: string } }): Date | undefined =>
  value ? new Date(Number(value.$date.$numberLong)) : undefined;

async function main() {
  const areas = readJson<AreaJson[]>("areas.json");
  const categories = readJson<CategoryJson[]>("categories.json");
  const ingredients = readJson<IngredientJson[]>("ingredients.json");
  const users = readJson<UserJson[]>("users.json");
  const recipes = readJson<RecipeJson[]>("recipes.json");
  const testimonials = readJson<TestimonialJson[]>("testimonials.json");

  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: oid(user._id) },
      update: {},
      create: {
        id: oid(user._id),
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });
  }

  console.log("Seeding areas...");
  for (const area of areas) {
    await prisma.area.upsert({
      where: { id: oid(area._id) },
      update: {},
      create: { id: oid(area._id), name: area.name },
    });
  }

  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: oid(category._id) },
      update: {},
      create: { id: oid(category._id), name: category.name },
    });
  }

  console.log("Seeding ingredients...");
  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { id: ingredient._id },
      update: {},
      create: {
        id: ingredient._id,
        name: ingredient.name,
        desc: ingredient.desc,
        img: ingredient.img,
      },
    });
  }

  const areaIdByName = new Map(areas.map((a) => [a.name, oid(a._id)]));
  const categoryIdByName = new Map(categories.map((c) => [c.name, oid(c._id)]));

  console.log("Seeding recipes...");
  for (const recipe of recipes) {
    const areaId = areaIdByName.get(recipe.area);
    const categoryId = categoryIdByName.get(recipe.category);
    if (!areaId || !categoryId) {
      console.warn(`Skipping recipe "${recipe.title}": unknown area/category`);
      continue;
    }

    await prisma.recipe.upsert({
      where: { id: oid(recipe._id) },
      update: {},
      create: {
        id: oid(recipe._id),
        title: recipe.title,
        instructions: recipe.instructions,
        description: recipe.description,
        thumb: recipe.thumb,
        time: recipe.time,
        createdAt: toDate(recipe.createdAt),
        updatedAt: toDate(recipe.updatedAt),
        ownerId: oid(recipe.owner),
        areaId,
        categoryId,
        ingredients: {
          create: recipe.ingredients.map((i) => ({
            measure: i.measure,
            ingredient: { connect: { id: i.id } },
          })),
        },
      },
    });
  }

  console.log("Seeding testimonials...");
  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: oid(testimonial._id) },
      update: {},
      create: {
        id: oid(testimonial._id),
        testimonial: testimonial.testimonial,
        ownerId: oid(testimonial.owner),
      },
    });
  }

  console.log("Seeding follow relations...");
  for (const user of users) {
    if (user.following.length === 0) continue;
    await prisma.user.update({
      where: { id: oid(user._id) },
      data: {
        following: {
          connect: user.following.map((id) => ({ id: oid(id) })),
        },
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
