/*
  Warnings:

  - You are about to drop the column `challenge` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `gallery` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `heroImageUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `process` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `results` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `testimonial` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `TeamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "challenge",
DROP COLUMN "client",
DROP COLUMN "duration",
DROP COLUMN "gallery",
DROP COLUMN "heroImageUrl",
DROP COLUMN "overview",
DROP COLUMN "process",
DROP COLUMN "results",
DROP COLUMN "services",
DROP COLUMN "solution",
DROP COLUMN "testimonial",
DROP COLUMN "year";

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "socialLinks",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "twitterUrl" TEXT;
