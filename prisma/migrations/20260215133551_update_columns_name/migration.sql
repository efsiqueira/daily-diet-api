/*
  Warnings:

  - You are about to drop the column `isOnDiet` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `is_on_diet` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "is_on_diet" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Meal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Meal" ("created_at", "date", "description", "id", "name", "updated_at") SELECT "created_at", "date", "description", "id", "name", "updated_at" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
