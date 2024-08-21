/*
  Warnings:

  - You are about to drop the column `amount` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `charge` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `japOrderId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `japServiceId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "amount",
ADD COLUMN     "charge" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "japOrderId" TEXT NOT NULL,
ADD COLUMN     "japServiceId" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Referral" ALTER COLUMN "status" SET DEFAULT 'pending';
