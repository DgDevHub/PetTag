/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "color" TEXT,
    "age" TEXT,
    "weight" TEXT,
    "photo" TEXT,
    "medicalInfo" TEXT,
    "observations" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QRCode" (
    "id" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "foregroundColor" TEXT NOT NULL DEFAULT '#000000',
    "customText" TEXT,
    "customBackground" TEXT,
    "logoUrl" TEXT,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "ownerAddress" TEXT,
    "emergencyContact" TEXT,
    "rewardOffered" BOOLEAN NOT NULL DEFAULT false,
    "rewardAmount" TEXT,
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "lastScanned" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QRCodeScan" (
    "id" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,

    CONSTRAINT "QRCodeScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "public"."Pet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_qrCodeId_key" ON "public"."QRCode"("qrCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_petId_key" ON "public"."QRCode"("petId");

-- CreateIndex
CREATE INDEX "QRCode_qrCodeId_idx" ON "public"."QRCode"("qrCodeId");

-- CreateIndex
CREATE INDEX "QRCode_petId_idx" ON "public"."QRCode"("petId");

-- CreateIndex
CREATE INDEX "QRCodeScan_qrCodeId_idx" ON "public"."QRCodeScan"("qrCodeId");

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QRCode" ADD CONSTRAINT "QRCode_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QRCodeScan" ADD CONSTRAINT "QRCodeScan_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "public"."QRCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
