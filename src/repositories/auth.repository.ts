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

export function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({
    data,
  });
}

export function findValidPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
}

export function markPasswordResetTokenUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

export function deleteUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}