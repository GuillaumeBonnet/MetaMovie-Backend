-- CreateTable
CREATE TABLE "confirmEmailUserToken" (
    "id" SERIAL NOT NULL,
    "randomNumber" INTEGER NOT NULL,
    "creation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "confirmEmailUserToken.userId_unique" ON "confirmEmailUserToken"("userId");

-- AddForeignKey
ALTER TABLE "confirmEmailUserToken" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
