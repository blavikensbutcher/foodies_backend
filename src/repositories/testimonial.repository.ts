import prisma from "../lib/prisma";

export function findAll() {
  return prisma.testimonial.findMany({
    select: {
      id: true,
      testimonial: true,
      owner: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
}
