import prisma from "../lib/prisma";

export async function generateReferralCode() {
  let code = "";
  let exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const found = await prisma.referral.findUnique({
      where: { referralCode: code },
    });

    exists = found !== null;
}
  return code;
}
