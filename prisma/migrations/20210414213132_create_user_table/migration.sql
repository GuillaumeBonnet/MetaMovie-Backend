-- AlterTable
ALTER TABLE "deck" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "user" (
"id" SERIAL,
    "creation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deck" ADD FOREIGN KEY("userId")REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
