import prisma from "../lib/prisma";

export const findFavoritesByUserId = async (id: string) => {
  const favorite = await prisma.user.findUnique({
    where: { id },
    select: {
      favorites: true,
    },
  });
  return favorite;
};
