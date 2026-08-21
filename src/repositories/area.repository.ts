import prisma from "../lib/prisma";

export function findAll() {
  return prisma.area.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export function findById(id: string) {
  return prisma.area.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
}
