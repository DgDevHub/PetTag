-- AlterTable
ALTER TABLE "public"."QRCode" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "borderRadius" INTEGER DEFAULT 0,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "padding" INTEGER DEFAULT 20,
ADD COLUMN     "qrSize" INTEGER DEFAULT 300,
ADD COLUMN     "textBottom" TEXT,
ADD COLUMN     "textBottomColor" TEXT DEFAULT '#000000',
ADD COLUMN     "textBottomSize" INTEGER DEFAULT 24,
ADD COLUMN     "textTop" TEXT,
ADD COLUMN     "textTopColor" TEXT DEFAULT '#000000',
ADD COLUMN     "textTopSize" INTEGER DEFAULT 24;
