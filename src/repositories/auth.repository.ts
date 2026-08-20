import prisma from "../lib/prisma";

export function createSession(data: {
  userId: string;
  expiresAt: Date;
}) {
  return prisma.session.create({
    data,
  });
}

export function findSessionById(id: string) {
  return prisma.session.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export function deleteSession(id: string) {
  return prisma.session.delete({
    where: { id },
  });
}