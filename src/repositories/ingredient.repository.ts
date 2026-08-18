import prisma from "../lib/prisma";

export function findAll() {
  return prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      desc: true,
      img: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
