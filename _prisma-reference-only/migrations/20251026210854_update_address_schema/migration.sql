/*
  Warnings:

  - You are about to drop the column `city` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailAddress` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses"
ADD COLUMN     "address" TEXT DEFAULT '',
ADD COLUMN     "deliveryRequest" TEXT NOT NULL DEFAULT '문 앞',
ADD COLUMN     "detailAddress" TEXT DEFAULT '',
ADD COLUMN     "entranceCode" TEXT,
ADD COLUMN     "phone" TEXT DEFAULT '',
ADD COLUMN     "recipientName" TEXT DEFAULT '';

-- Update existing addresses with default values
UPDATE "addresses"
SET
  "address" = COALESCE("street" || ' ' || "city", ''),
  "detailAddress" = '',
  "phone" = '',
  "recipientName" = ''
WHERE "address" IS NULL OR "address" = '';

-- Now drop the old columns
ALTER TABLE "addresses" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "type";

-- Make the new columns NOT NULL
ALTER TABLE "addresses"
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "detailAddress" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "recipientName" SET NOT NULL;
