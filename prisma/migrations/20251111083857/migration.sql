/*
  Warnings:

  - You are about to drop the `wallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referral]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referral` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referral" TEXT NOT NULL;

-- DropTable
DROP TABLE "wallet";

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_key" ON "users"("referral");
