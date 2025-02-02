-- CreateEnum
CREATE TYPE "ESmsPoolOrderStatus" AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- AlterTable
ALTER TABLE "SmsPoolOrder" ADD COLUMN     "status" "ESmsPoolOrderStatus" NOT NULL DEFAULT 'pending';
