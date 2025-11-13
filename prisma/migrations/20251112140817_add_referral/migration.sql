/*
  Warnings:

  - You are about to drop the column `referral` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_referral_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "referral";

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referral" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referral_key" ON "Referral"("referral");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_userId_key" ON "Referral"("userId");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
