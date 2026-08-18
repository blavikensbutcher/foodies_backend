import prisma from "../lib/prisma";

const favorite = prisma.recipe.findMany()