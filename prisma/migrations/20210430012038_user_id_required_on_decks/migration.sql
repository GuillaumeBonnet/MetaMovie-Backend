/*
  Warnings:

  - Made the column `userId` on table `deck` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "deck" ALTER COLUMN "userId" SET NOT NULL;
