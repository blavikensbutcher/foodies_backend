import prisma from "../lib/prisma";

const userSelect = {
  id: true,
  name: true,
  avatar: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}
