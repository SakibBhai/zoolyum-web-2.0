-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "challenge" TEXT,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "gallery" JSONB,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "process" JSONB,
ADD COLUMN     "results" JSONB,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "testimonial" JSONB,
ADD COLUMN     "year" TEXT;
