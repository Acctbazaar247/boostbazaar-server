-- CreateEnum
CREATE TYPE "EStatusOfManualCurrencyRequest" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "ECryptoType" AS ENUM ('USDT', 'USDC', 'BTC', 'SOLANA');

-- CreateTable
CREATE TABLE "ManualCurrencyRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "image" TEXT,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "receivedAmount" DOUBLE PRECISION,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfManualCurrencyRequest" NOT NULL DEFAULT 'pending',
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "transactionHash" TEXT,
    "dollarRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankId" TEXT,
    "cryptoBankId" TEXT,

    CONSTRAINT "ManualCurrencyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoBank" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualCurrencyRequest_id_key" ON "ManualCurrencyRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_id_key" ON "Bank"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoBank_id_key" ON "CryptoBank"("id");

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_cryptoBankId_fkey" FOREIGN KEY ("cryptoBankId") REFERENCES "CryptoBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
