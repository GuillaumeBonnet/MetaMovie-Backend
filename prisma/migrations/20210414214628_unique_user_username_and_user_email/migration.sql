/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[email]` on the table `user`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[username]` on the table `user`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user.username_unique" ON "user"("username");
