-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "hero_image_url" TEXT,
    "year" TEXT,
    "client" TEXT,
    "duration" TEXT,
    "services" TEXT[],
    "overview" TEXT,
    "challenge" TEXT,
    "solution" TEXT,
    "process" JSONB,
    "gallery" JSONB,
    "results" JSONB,
    "testimonial" JSONB,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "project_url" TEXT,
    "github_url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_published_idx" ON "projects"("published");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");
