/*
  Warnings:

  - You are about to drop the column `firstname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `RegisToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[registoken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fiestname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registoken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstname",
ADD COLUMN     "fiestname" TEXT NOT NULL,
ADD COLUMN     "registoken" TEXT NOT NULL;

-- DropTable
DROP TABLE "RegisToken";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_registoken_key" ON "users"("registoken");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
