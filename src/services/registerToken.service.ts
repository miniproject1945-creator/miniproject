import prisma from "../lib/prisma";

export async function getRegisterToken(token: string) {
  return await prisma.regisToken.findUnique({
    where: {
      token,
    },
  });
}
