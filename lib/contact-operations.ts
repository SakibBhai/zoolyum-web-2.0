import { query } from "./postgres";
import { DatabaseError } from "pg";

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  company?: string;
  businessName?: string;
  businessWebsite?: string;
  services?: string[];
  subject?: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSettings {
  id: number;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  behanceUrl?: string;
  enablePhoneField: boolean;
  requirePhoneField: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage?: string;
  notificationEmail?: string;
  emailNotifications: boolean;
  updatedAt: Date;
}

export interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

// Validation
export function validateContactData(data: any) {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email address is required");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  // Enhanced phone validation for Bangladesh numbers
  if (data.phone) {
    const countryCode = data.countryCode || "+880";
    if (countryCode === "+880") {
      // Bangladesh phone number validation (11 digits)
      const phoneDigits = data.phone.replace(/\D/g, '');
      if (!/^01[3-9]\d{8}$/.test(phoneDigits)) {
        errors.push("Bangladesh phone number must be 11 digits starting with 013-019");
      }
    } else {
      // General international phone validation
      if (!/^[\+]?[1-9][\d\s\-\(\)]{7,}$/.test(data.phone)) {
        errors.push("Invalid phone number format");
      }
    }
  }

  // Business website validation
  if (data.businessWebsite) {
    try {
      new URL(data.businessWebsite);
    } catch {
      errors.push("Business website must be a valid URL");
    }
  }

  // Business name validation
  if (data.businessName && data.businessName.trim().length < 2) {
    errors.push("Business name must be at least 2 characters long");
  }

  // Services validation
  if (data.services && !Array.isArray(data.services)) {
    errors.push("Services must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Contact CRUD operations
export async function createContact(
  data: Omit<Contact, "id" | "createdAt" | "updatedAt">
): Promise<Contact> {
  // Generate a CUID for the ID to match Prisma's default
  const { createId } = await import('@paralleldrive/cuid2');
  const id = createId();
  
  const result = await query(
    `INSERT INTO contacts (id, name, email, phone, country_code, company, business_name, business_website, services, subject, message, status, ip_address, user_agent, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
     RETURNING *`,
    [
      id,
      data.name,
      data.email,
      data.phone,
      data.countryCode || "+880",
      data.company,
      data.businessName,
      data.businessWebsite,
      data.services || [],
      data.subject,
      data.message,
      data.status || "NEW",
      data.ipAddress,
      data.userAgent,
    ]
  );

  return mapContactFromDb(result.rows[0]);
}

export async function fetchContacts(
  limit = 50,
  offset = 0
): Promise<Contact[]> {
  const result = await query(
    `SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows.map(mapContactFromDb);
}

export async function fetchContact(id: string): Promise<Contact | null> {
  const result = await query(`SELECT * FROM contacts WHERE id = $1`, [id]);

  return result.rows.length > 0 ? mapContactFromDb(result.rows[0]) : null;
}

export async function updateContact(
  id: string,
  data: Partial<Contact>
): Promise<Contact | null> {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "createdAt") {
      const dbKey =
        key === "ipAddress"
          ? "ip_address"
          : key === "userAgent"
          ? "user_agent"
          : key === "updatedAt"
          ? "updated_at"
          : key === "countryCode"
          ? "country_code"
          : key === "businessName"
          ? "business_name"
          : key === "businessWebsite"
          ? "business_website"
          : key;
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE contacts SET ${fields.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows.length > 0 ? mapContactFromDb(result.rows[0]) : null;
}

export async function deleteContact(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM contacts WHERE id = $1`, [id]);

  return result?.rowCount ? result.rowCount > 0 : false;
}

// Contact Settings operations
export class ContactOperationError extends Error {
  constructor(message: string, public code?: string, public cause?: Error) {
    super(message);
    this.name = "ContactOperationError";
  }
}

// Helper function to handle database errors
function handleDatabaseError(error: unknown): never {
  if (error instanceof DatabaseError) {
    throw new ContactOperationError(
      "Database operation failed",
      error.code,
      error
    );
  }
  throw new ContactOperationError(
    "An unexpected error occurred",
    undefined,
    error instanceof Error ? error : undefined
  );
}

// Fetch contact settings with proper error handling
export async function fetchContactSettings(): Promise<ContactSettings | null> {
  try {
    const result = await query(
      `SELECT 
        id, email, phone, address, working_hours, 
        twitter_url, linkedin_url, instagram_url, behance_url,
        enable_phone_field, require_phone_field, auto_reply_enabled,
        auto_reply_message, notification_email, email_notifications,
        updated_at
      FROM contact_settings 
      ORDER BY id DESC LIMIT 1`
    );

    return result.rows[0] ? mapContactSettingsFromDb(result.rows[0]) : null;
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Update contact settings with validation and error handling
export async function updateContactSettings(
  settings: Partial<ContactSettings>
): Promise<ContactSettings> {
  try {
    // Validate required fields
    if (!settings.email || !settings.email.trim()) {
      throw new ContactOperationError("Email is required");
    }

    const result = await query(
      `
      INSERT INTO contact_settings (
        email, phone, address, working_hours, 
        twitter_url, linkedin_url, instagram_url, behance_url,
        enable_phone_field, require_phone_field, auto_reply_enabled,
        auto_reply_message, notification_email, email_notifications
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `,
      [
        settings.email.trim(),
        settings.phone?.trim() || "",
        settings.address?.trim() || "",
        settings.workingHours?.trim() || "",
        settings.twitterUrl?.trim() || null,
        settings.linkedinUrl?.trim() || null,
        settings.instagramUrl?.trim() || null,
        settings.behanceUrl?.trim() || null,
        settings.enablePhoneField ?? true,
        settings.requirePhoneField ?? false,
        settings.autoReplyEnabled ?? false,
        settings.autoReplyMessage?.trim() || null,
        settings.notificationEmail?.trim() || null,
        settings.emailNotifications ?? true,
      ]
    );

    if (!result.rows[0]) {
      throw new ContactOperationError("Failed to update contact settings");
    }

    return mapContactSettingsFromDb(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Contact Stats
export async function getContactStats(): Promise<ContactStats> {
  const [totalResult, statusResult, monthlyResult] = await Promise.all([
    query(`SELECT COUNT(*) as total FROM contacts`),
    query(`
      SELECT status, COUNT(*) as count 
      FROM contacts 
      GROUP BY status
    `),
    query(`
      SELECT 
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as this_month,
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                   AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 END) as last_month
      FROM contacts
    `),
  ]);

  const total = parseInt(totalResult.rows[0].total);
  const statusCounts = statusResult.rows.reduce((acc: any, row: any) => {
    acc[row.status.toLowerCase()] = parseInt(row.count);
    return acc;
  }, {});

  const thisMonth = parseInt(monthlyResult.rows[0].this_month);
  const lastMonth = parseInt(monthlyResult.rows[0].last_month);
  const growth =
    lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return {
    total,
    new: statusCounts.new || 0,
    read: statusCounts.read || 0,
    replied: statusCounts.replied || 0,
    archived: statusCounts.archived || 0,
    thisMonth,
    lastMonth,
    growth: Math.round(growth * 100) / 100,
  };
}

// Helper functions to map database rows to TypeScript objects
function mapContactFromDb(row: any): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    countryCode: row.country_code,
    company: row.company,
    businessName: row.business_name,
    businessWebsite: row.business_website,
    services: row.services || [],
    subject: row.subject,
    message: row.message,
    status: row.status,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapContactSettingsFromDb(row: any): ContactSettings {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    address: row.address,
    workingHours: row.working_hours,
    twitterUrl: row.twitter_url,
    linkedinUrl: row.linkedin_url,
    instagramUrl: row.instagram_url,
    behanceUrl: row.behance_url,
    enablePhoneField: row.enable_phone_field,
    requirePhoneField: row.require_phone_field,
    autoReplyEnabled: row.auto_reply_enabled,
    autoReplyMessage: row.auto_reply_message,
    notificationEmail: row.notification_email,
    emailNotifications: row.email_notifications,
    updatedAt: row.updated_at,
  };
}
