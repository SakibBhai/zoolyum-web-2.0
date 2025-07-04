import { query } from './postgres'

// Types
export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  imageUrl?: string
  featured: boolean
  approved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TestimonialStats {
  total: number
  approved: number
  pending: number
  featured: number
  averageRating: number
  thisMonth: number
  lastMonth: number
  growth: number
}

// Validation
export function validateTestimonialData(data: any) {
  const errors: string[] = []
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  
  if (!data.position || data.position.trim().length < 2) {
    errors.push('Position must be at least 2 characters long')
  }
  
  if (!data.company || data.company.trim().length < 2) {
    errors.push('Company must be at least 2 characters long')
  }
  
  if (!data.content || data.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long')
  }
  
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push('Rating must be between 1 and 5')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Testimonial CRUD operations
export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> {
  const result = await query(
    `INSERT INTO testimonials (name, position, company, content, rating, image_url, featured, approved, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     RETURNING *`,
    [
      data.name,
      data.position,
      data.company,
      data.content,
      data.rating || 5,
      data.imageUrl,
      data.featured || false,
      data.approved || false
    ]
  )
  
  return mapTestimonialFromDb(result.rows[0])
}

export async function fetchTestimonials(options: {
  limit?: number
  offset?: number
  approved?: boolean
  featured?: boolean
} = {}): Promise<Testimonial[]> {
  const { limit = 50, offset = 0, approved, featured } = options
  
  let whereClause = ''
  const params: any[] = []
  let paramCount = 1
  
  const conditions: string[] = []
  
  if (approved !== undefined) {
    conditions.push(`approved = $${paramCount}`)
    params.push(approved)
    paramCount++
  }
  
  if (featured !== undefined) {
    conditions.push(`featured = $${paramCount}`)
    params.push(featured)
    paramCount++
  }
  
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(' AND ')}`
  }
  
  params.push(limit, offset)
  
  const result = await query(
    `SELECT * FROM testimonials ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    params
  )
  
  return result.rows.map(mapTestimonialFromDb)
}

export async function fetchTestimonial(id: string): Promise<Testimonial | null> {
  const result = await query(
    `SELECT * FROM testimonials WHERE id = $1`,
    [id]
  )
  
  return result.rows.length > 0 ? mapTestimonialFromDb(result.rows[0]) : null
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
  const fields = []
  const values = []
  let paramCount = 1
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'createdAt') {
      const dbKey = key === 'imageUrl' ? 'image_url' : key === 'updatedAt' ? 'updated_at' : key
      fields.push(`${dbKey} = $${paramCount}`)
      values.push(value)
      paramCount++
    }
  })
  
  if (fields.length === 0) return null
  
  fields.push(`updated_at = NOW()`)
  values.push(id)
  
  const result = await query(
    `UPDATE testimonials SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  )
  
  return result.rows.length > 0 ? mapTestimonialFromDb(result.rows[0]) : null
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const result = await query(
    `DELETE FROM testimonials WHERE id = $1`,
    [id]
  )
  
  return result?.rowCount ? result.rowCount > 0 : false
}

// Featured testimonials
export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const result = await query(
    `SELECT * FROM testimonials WHERE featured = true AND approved = true ORDER BY created_at DESC LIMIT $1`,
    [limit]
  )
  
  return result.rows.map(mapTestimonialFromDb)
}

export async function setTestimonialFeatured(id: string, featured: boolean): Promise<Testimonial | null> {
  const result = await query(
    `UPDATE testimonials SET featured = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [featured, id]
  )
  
  return result.rows.length > 0 ? mapTestimonialFromDb(result.rows[0]) : null
}

// Approval
export async function approveTestimonial(id: string, approved: boolean): Promise<Testimonial | null> {
  const result = await query(
    `UPDATE testimonials SET approved = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [approved, id]
  )
  
  return result.rows.length > 0 ? mapTestimonialFromDb(result.rows[0]) : null
}

// Statistics
export async function getTestimonialStats(): Promise<TestimonialStats> {
  const [totalResult, statusResult, ratingResult, monthlyResult] = await Promise.all([
    query(`SELECT COUNT(*) as total FROM testimonials`),
    query(`
      SELECT 
        COUNT(CASE WHEN approved = true THEN 1 END) as approved,
        COUNT(CASE WHEN approved = false THEN 1 END) as pending,
        COUNT(CASE WHEN featured = true THEN 1 END) as featured
      FROM testimonials
    `),
    query(`SELECT AVG(rating) as average_rating FROM testimonials WHERE approved = true`),
    query(`
      SELECT 
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as this_month,
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                   AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 END) as last_month
      FROM testimonials
    `)
  ])
  
  const total = parseInt(totalResult.rows[0].total)
  const statusData = statusResult.rows[0]
  const averageRating = parseFloat(ratingResult.rows[0].average_rating) || 0
  const thisMonth = parseInt(monthlyResult.rows[0].this_month)
  const lastMonth = parseInt(monthlyResult.rows[0].last_month)
  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0
  
  return {
    total,
    approved: parseInt(statusData.approved),
    pending: parseInt(statusData.pending),
    featured: parseInt(statusData.featured),
    averageRating: Math.round(averageRating * 100) / 100,
    thisMonth,
    lastMonth,
    growth: Math.round(growth * 100) / 100
  }
}

// Helper function to map database rows to TypeScript objects
function mapTestimonialFromDb(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    company: row.company,
    content: row.content,
    rating: row.rating,
    imageUrl: row.image_url,
    featured: row.featured,
    approved: row.approved,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}