import { query } from "./postgres";
import { DatabaseError } from "pg";

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  hours: string;
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

  if (data.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,}$/.test(data.phone)) {
    errors.push("Invalid phone number format");
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
  const result = await query(
    `INSERT INTO contacts (name, email, phone, subject, message, status, ip_address, user_agent, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     RETURNING *`,
    [
      data.name,
      data.email,
      data.phone,
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
      `SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1`
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
      INSERT INTO contact_settings (email, phone, address, hours)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        settings.email.trim(),
        settings.phone?.trim() || "",
        settings.address?.trim() || "",
        settings.hours?.trim() || "",
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
    hours: row.hours,
    updatedAt: row.updated_at,
  };
}
