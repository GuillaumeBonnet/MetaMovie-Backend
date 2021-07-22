/*
  Warnings:

  - You are about to alter the column `position_x` on the `card` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `position_y` on the `card` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `salt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "card" ALTER COLUMN "position_x" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "position_y" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "salt";
