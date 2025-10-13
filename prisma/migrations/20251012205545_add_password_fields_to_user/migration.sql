-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isTemporaryPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
