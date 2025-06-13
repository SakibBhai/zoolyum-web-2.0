import { prisma } from '@/lib/db'

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: string
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateContactData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  ipAddress?: string
  userAgent?: string
}

export interface UpdateContactData {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  status?: string
}

export interface ContactSettings {
  id: string
  email?: string | null
  phone?: string | null
  address?: string | null
  workingHours?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
  behanceUrl?: string | null
  enablePhoneField: boolean
  requirePhoneField: boolean
  autoReplyEnabled: boolean
  autoReplyMessage?: string | null
  notificationEmail?: string | null
  emailNotifications: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UpdateContactSettingsData {
  email?: string
  phone?: string
  address?: string
  workingHours?: string
  twitterUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  behanceUrl?: string
  enablePhoneField?: boolean
  requirePhoneField?: boolean
  autoReplyEnabled?: boolean
  autoReplyMessage?: string
  notificationEmail?: string
  emailNotifications?: boolean
}

// Contact CRUD Operations
export async function fetchContacts(): Promise<Contact[]> {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return contacts
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw new Error('Failed to fetch contacts')
  }
}

export async function fetchContact(id: string): Promise<Contact | null> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id }
    })
    return contact
  } catch (error) {
    console.error('Error fetching contact:', error)
    throw new Error('Failed to fetch contact')
  }
}

export async function createContact(data: CreateContactData): Promise<Contact> {
  try {
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        status: 'new'
      }
    })
    return contact
  } catch (error) {
    console.error('Error creating contact:', error)
    throw new Error('Failed to create contact')
  }
}

export async function updateContact(id: string, data: UpdateContactData): Promise<Contact> {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.subject !== undefined && { subject: data.subject || null }),
        ...(data.message && { message: data.message }),
        ...(data.status && { status: data.status })
      }
    })
    return contact
  } catch (error) {
    console.error('Error updating contact:', error)
    throw new Error('Failed to update contact')
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    await prisma.contact.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    throw new Error('Failed to delete contact')
  }
}

// Contact Settings Operations
export async function fetchContactSettings(): Promise<ContactSettings | null> {
  try {
    const settings = await prisma.contactSettings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching contact settings:', error)
    throw new Error('Failed to fetch contact settings')
  }
}

export async function updateContactSettings(data: UpdateContactSettingsData): Promise<ContactSettings> {
  try {
    // First, try to find existing settings
    const existingSettings = await prisma.contactSettings.findFirst()
    
    if (existingSettings) {
      // Update existing settings
      const settings = await prisma.contactSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...(data.email !== undefined && { email: data.email || null }),
          ...(data.phone !== undefined && { phone: data.phone || null }),
          ...(data.address !== undefined && { address: data.address || null }),
          ...(data.workingHours !== undefined && { workingHours: data.workingHours || null }),
          ...(data.twitterUrl !== undefined && { twitterUrl: data.twitterUrl || null }),
          ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl || null }),
          ...(data.instagramUrl !== undefined && { instagramUrl: data.instagramUrl || null }),
          ...(data.behanceUrl !== undefined && { behanceUrl: data.behanceUrl || null }),
          ...(data.enablePhoneField !== undefined && { enablePhoneField: data.enablePhoneField }),
          ...(data.requirePhoneField !== undefined && { requirePhoneField: data.requirePhoneField }),
          ...(data.autoReplyEnabled !== undefined && { autoReplyEnabled: data.autoReplyEnabled }),
          ...(data.autoReplyMessage !== undefined && { autoReplyMessage: data.autoReplyMessage || null }),
          ...(data.notificationEmail !== undefined && { notificationEmail: data.notificationEmail || null }),
          ...(data.emailNotifications !== undefined && { emailNotifications: data.emailNotifications })
        }
      })
      return settings
    } else {
      // Create new settings
      const settings = await prisma.contactSettings.create({
        data: {
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          workingHours: data.workingHours || null,
          twitterUrl: data.twitterUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          instagramUrl: data.instagramUrl || null,
          behanceUrl: data.behanceUrl || null,
          enablePhoneField: data.enablePhoneField ?? true,
          requirePhoneField: data.requirePhoneField ?? false,
          autoReplyEnabled: data.autoReplyEnabled ?? false,
          autoReplyMessage: data.autoReplyMessage || null,
          notificationEmail: data.notificationEmail || null,
          emailNotifications: data.emailNotifications ?? true
        }
      })
      return settings
    }
  } catch (error) {
    console.error('Error updating contact settings:', error)
    throw new Error('Failed to update contact settings')
  }
}

// Validation functions
export function validateContactData(data: CreateContactData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }
  
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required')
  }
  
  if (data.phone && data.phone.trim().length > 0) {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Statistics
export async function getContactStats() {
  try {
    const [total, newContacts, readContacts, repliedContacts] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.contact.count({ where: { status: 'read' } }),
      prisma.contact.count({ where: { status: 'replied' } })
    ])
    
    return {
      total,
      new: newContacts,
      read: readContacts,
      replied: repliedContacts,
      archived: total - newContacts - readContacts - repliedContacts
    }
  } catch (error) {
    console.error('Error fetching contact stats:', error)
    throw new Error('Failed to fetch contact statistics')
  }
}