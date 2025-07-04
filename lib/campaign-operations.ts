'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma' // Assuming you have a prisma client instance

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().optional(),
  content: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']),
  imageUrls: z.array(z.string()).optional(),
  videoUrls: z.array(z.string()).optional(),
  enableForm: z.boolean(),
  successMessage: z.string().optional(),
  redirectUrl: z.string().optional(),
  ctas: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  formFields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'tel', 'textarea']),
    required: z.boolean(),
    placeholder: z.string().optional(),
  })).optional(),
})

export async function createCampaign(formData: FormData) {
  const validatedFields = campaignSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const campaign = await prisma.campaign.create({
      data: validatedFields.data,
    })
    
    revalidatePath('/admin/campaigns')
    revalidatePath(`/campaigns/${campaign.slug}`)

    return { campaign }
  } catch (error) {
    console.error('Error creating campaign:', error)
    return {
      error: 'Failed to create campaign.',
    }
  }
}

export async function updateCampaign(id: string, formData: FormData) {
  const validatedFields = campaignSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: validatedFields.data,
    })

    revalidatePath('/admin/campaigns')
    revalidatePath(`/campaigns/${campaign.slug}`)

    return { campaign }
  } catch (error) {
    console.error('Error updating campaign:', error)
    return {
      error: 'Failed to update campaign.',
    }
  }
}