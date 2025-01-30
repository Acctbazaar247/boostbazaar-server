-- CreateTable
CREATE TABLE "SmsPoolOrder" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "orderById" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsPoolOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmsPoolOrder_id_key" ON "SmsPoolOrder"("id");

-- AddForeignKey
ALTER TABLE "SmsPoolOrder" ADD CONSTRAINT "SmsPoolOrder_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
