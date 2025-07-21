-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "user_agent" TEXT;

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "address" TEXT NOT NULL,
    "working_hours" VARCHAR(255) NOT NULL,
    "twitter_url" VARCHAR(255),
    "linkedin_url" VARCHAR(255),
    "instagram_url" VARCHAR(255),
    "behance_url" VARCHAR(255),
    "enable_phone_field" BOOLEAN NOT NULL DEFAULT true,
    "require_phone_field" BOOLEAN NOT NULL DEFAULT false,
    "auto_reply_enabled" BOOLEAN NOT NULL DEFAULT false,
    "auto_reply_message" TEXT,
    "notification_email" VARCHAR(255),
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_submissions" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "campaign_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_submissions_campaign_id_idx" ON "campaign_submissions"("campaign_id");

-- CreateIndex
CREATE INDEX "campaign_submissions_submitted_at_idx" ON "campaign_submissions"("submitted_at");

-- CreateIndex
CREATE INDEX "idx_contacts_created_at" ON "contacts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_contacts_email" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "idx_contacts_status" ON "contacts"("status");

-- AddForeignKey
ALTER TABLE "campaign_submissions" ADD CONSTRAINT "campaign_submissions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
