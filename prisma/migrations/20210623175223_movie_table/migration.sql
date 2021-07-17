-- AlterTable
ALTER TABLE "deck" ADD COLUMN     "movieId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "movie" (
    "netflixId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("netflixId")
);

-- AddForeignKey
ALTER TABLE "deck" ADD FOREIGN KEY ("movieId") REFERENCES "movie"("netflixId") ON DELETE CASCADE ON UPDATE CASCADE;
