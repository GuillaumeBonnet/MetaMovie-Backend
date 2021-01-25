-- CreateTable
CREATE TABLE "card" (
"id" SERIAL,
    "creation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMP(3) NOT NULL,
    "deck_order" INTEGER NOT NULL,
    "from_moment" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "to_moment" TEXT NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "position_x" DECIMAL(65,30) NOT NULL,
    "position_y" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck" (
"id" SERIAL,
    "creation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_timestamp" TIMESTAMP(3) NOT NULL,
    "language_tag" TEXT,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card" ADD FOREIGN KEY("deck_id")REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
