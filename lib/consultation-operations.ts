import { query } from "./postgres";
import { DatabaseError } from "pg";

// Types
export interface Consultation {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  websiteUrl?: string;
  role?: string;
  mainChallenge: string;
  otherChallenge?: string;
  sessionGoal?: string;
  preferredDatetime?: Date;
  additionalNotes?: string;
  consultationType: "brand_strategy" | "digital_strategy" | "creative_direction";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultationStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  byType: {
    brandStrategy: number;
    digitalStrategy: number;
    creativeDirection: number;
  };
}

// Validation
export function validateConsultationData(data: any) {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email address is required");
  }

  if (!data.mainChallenge) {
    errors.push("Main challenge is required");
  }

  if (data.mainChallenge === "other" && (!data.otherChallenge || data.otherChallenge.trim().length < 5)) {
    errors.push("Please describe your challenge when selecting 'Other'");
  }

  if (data.websiteUrl && !/^https?:\/\/.+/.test(data.websiteUrl)) {
    errors.push("Website URL must be a valid URL starting with http:// or https://");
  }

  if (data.preferredDatetime) {
    const datetime = new Date(data.preferredDatetime);
    const now = new Date();
    if (datetime <= now) {
      errors.push("Preferred date and time must be in the future");
    }
  }

  const validConsultationTypes = ["brand_strategy", "digital_strategy", "creative_direction"];
  if (data.consultationType && !validConsultationTypes.includes(data.consultationType)) {
    errors.push("Invalid consultation type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper function to map database row to Consultation object
function mapConsultationFromDb(row: any): Consultation {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    companyName: row.company_name,
    websiteUrl: row.website_url,
    role: row.role,
    mainChallenge: row.main_challenge,
    otherChallenge: row.other_challenge,
    sessionGoal: row.session_goal,
    preferredDatetime: row.preferred_datetime ? new Date(row.preferred_datetime) : undefined,
    additionalNotes: row.additional_notes,
    consultationType: row.consultation_type,
    status: row.status,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Consultation CRUD operations
export async function createConsultation(
  data: Omit<Consultation, "id" | "createdAt" | "updatedAt">
): Promise<Consultation> {
  const { createId } = await import('@paralleldrive/cuid2');
  const id = createId();
  
  const result = await query(
    `INSERT INTO consultations (
      id, full_name, email, company_name, website_url, role, 
      main_challenge, other_challenge, session_goal, preferred_datetime, 
      additional_notes, consultation_type, status, ip_address, user_agent, 
      created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
    RETURNING *`,
    [
      id,
      data.fullName,
      data.email,
      data.companyName,
      data.websiteUrl,
      data.role,
      data.mainChallenge,
      data.otherChallenge,
      data.sessionGoal,
      data.preferredDatetime,
      data.additionalNotes,
      data.consultationType || "brand_strategy",
      data.status || "PENDING",
      data.ipAddress,
      data.userAgent,
    ]
  );

  return mapConsultationFromDb(result.rows[0]);
}

export async function fetchConsultations(
  options: {
    limit?: number;
    offset?: number;
    status?: string;
    consultationType?: string;
  } = {}
): Promise<Consultation[]> {
  const { limit = 50, offset = 0, status, consultationType } = options;

  let whereClause = "";
  const params: any[] = [];
  let paramCount = 1;

  const conditions: string[] = [];

  if (status) {
    conditions.push(`status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  if (consultationType) {
    conditions.push(`consultation_type = $${paramCount}`);
    params.push(consultationType);
    paramCount++;
  }

  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(" AND ")}`;
  }

  params.push(limit, offset);

  const result = await query(
    `SELECT * FROM consultations ${whereClause} 
     ORDER BY created_at DESC 
     LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    params
  );

  return result.rows.map(mapConsultationFromDb);
}

export async function fetchConsultationById(id: string): Promise<Consultation | null> {
  const result = await query(
    `SELECT * FROM consultations WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapConsultationFromDb(result.rows[0]);
}

export async function updateConsultation(
  id: string,
  data: Partial<Omit<Consultation, "id" | "createdAt" | "updatedAt">>
): Promise<Consultation | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbField} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await fetchConsultationById(id);
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE consultations SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapConsultationFromDb(result.rows[0]);
}

export async function deleteConsultation(id: string): Promise<boolean> {
  const result = await query(
    `DELETE FROM consultations WHERE id = $1`,
    [id]
  );

  return result.rowCount > 0;
}

export async function getConsultationStats(): Promise<ConsultationStats> {
  // Get total counts by status
  const statusResult = await query(
    `SELECT 
       status,
       COUNT(*) as count
     FROM consultations 
     GROUP BY status`
  );

  // Get counts by consultation type
  const typeResult = await query(
    `SELECT 
       consultation_type,
       COUNT(*) as count
     FROM consultations 
     GROUP BY consultation_type`
  );

  // Get monthly stats
  const monthlyResult = await query(
    `SELECT 
       DATE_TRUNC('month', created_at) as month,
       COUNT(*) as count
     FROM consultations 
     WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
     GROUP BY DATE_TRUNC('month', created_at)
     ORDER BY month`
  );

  // Process results
  const statusCounts = statusResult.rows.reduce((acc, row) => {
    acc[row.status.toLowerCase()] = parseInt(row.count);
    return acc;
  }, {});

  const typeCounts = typeResult.rows.reduce((acc, row) => {
    const key = row.consultation_type.replace('_', '');
    acc[key] = parseInt(row.count);
    return acc;
  }, {});

  const thisMonth = monthlyResult.rows.find(row => 
    new Date(row.month).getMonth() === new Date().getMonth()
  )?.count || 0;

  const lastMonth = monthlyResult.rows.find(row => 
    new Date(row.month).getMonth() === new Date().getMonth() - 1
  )?.count || 0;

  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return {
    total: Object.values(statusCounts).reduce((sum: number, count: number) => sum + count, 0),
    pending: statusCounts.pending || 0,
    confirmed: statusCounts.confirmed || 0,
    completed: statusCounts.completed || 0,
    cancelled: statusCounts.cancelled || 0,
    thisMonth: parseInt(thisMonth.toString()),
    lastMonth: parseInt(lastMonth.toString()),
    growth: Math.round(growth * 100) / 100,
    byType: {
      brandStrategy: typeCounts.brandstrategy || 0,
      digitalStrategy: typeCounts.digitalstrategy || 0,
      creativeDirection: typeCounts.creativedirection || 0,
    },
  };
}