/*
  Warnings:

  - Added the required column `link` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "link" TEXT NOT NULL;
