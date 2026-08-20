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

export function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function create(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data,
  });
}