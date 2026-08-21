import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { userCardSelect } from "./user.repository";
import { PrismaPagination } from "../types/pagination.types";

async function findUsersPage(
  where: Prisma.UserWhereInput,
  currentUserId: string,
  { skip, take }: PrismaPagination,
) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userCardSelect(currentUserId),
      orderBy: [{ name: "asc" }, { id: "asc" }],
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export function findFollowers(userId: string, currentUserId: string, pagination: PrismaPagination) {
  // followers of userId = users that keep userId in their own following list
  return findUsersPage({ following: { some: { id: userId } } }, currentUserId, pagination);
}

export function findFollowing(userId: string, currentUserId: string, pagination: PrismaPagination) {
  // mirrored relation: users that keep userId in their own followers list
  return findUsersPage({ followers: { some: { id: userId } } }, currentUserId, pagination);
}

export async function isFollowing(followerId: string, targetId: string) {
  const count = await prisma.user.count({
    where: {
      id: followerId,
      following: { some: { id: targetId } },
    },
  });

  return count > 0;
}

export function follow(followerId: string, targetId: string) {
  return prisma.user.update({
    where: { id: followerId },
    data: { following: { connect: { id: targetId } } },
    select: { id: true },
  });
}

export function unfollow(followerId: string, targetId: string) {
  return prisma.user.update({
    where: { id: followerId },
    data: { following: { disconnect: { id: targetId } } },
    select: { id: true },
  });
}
