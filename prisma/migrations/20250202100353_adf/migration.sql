/*
  Warnings:

  - Added the required column `cc` to the `SmsPoolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `SmsPoolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `SmsPoolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool` to the `SmsPoolOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `SmsPoolOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmsPoolOrder" ADD COLUMN     "cc" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "pool" TEXT NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL;
