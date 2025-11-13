/*
  Warnings:

  - You are about to drop the column `fiestname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `registoken` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_registoken_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "fiestname",
DROP COLUMN "registoken",
ADD COLUMN     "firstname" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RegisToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RegisToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisToken_token_key" ON "RegisToken"("token");
