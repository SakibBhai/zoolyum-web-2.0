'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma' // Assuming you have a prisma client instance

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().optional(),
  content: z.string().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  imageUrls: z.array(z.string()).optional(),
  videoUrls: z.array(z.string()).optional(),
  enableForm: z.boolean().optional(),
  successMessage: z.string().optional(),
  redirectUrl: z.string().optional(),
  ctas: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  formFields: z.array(z.object({
    id: z.string(),
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio', 'date', 'number']),
    required: z.boolean(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    options: z.array(z.string()).optional(),
  })).optional(),
})

type CampaignInput = z.infer<typeof campaignSchema>

export async function createCampaign(data: CampaignInput) {
  const validatedFields = campaignSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        ...validatedFields.data,
        formFields: validatedFields.data.formFields || [],
        ctas: validatedFields.data.ctas || [],
        imageUrls: validatedFields.data.imageUrls || [],
        videoUrls: validatedFields.data.videoUrls || [],
      },
    })
    
    revalidatePath('/admin/campaigns')
    revalidatePath(`/campaigns/${campaign.slug}`)

    return { success: true, campaign }
  } catch (error) {
    console.error('Error creating campaign:', error)
    return {
      success: false,
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