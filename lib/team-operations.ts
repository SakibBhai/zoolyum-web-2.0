import { prisma } from './prisma';
import { createId } from '@paralleldrive/cuid2';

export interface TeamMemberData {
  name: string;
  position?: string;
  designation?: string;
  websiteTag?: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  status?: string;
  order?: number;
  featured?: boolean;
}

export interface TeamMemberWithStatus {
  id: string;
  name: string;
  position: string | null;
  designation: string | null;
  websiteTag: string | null;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  status: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  statusDisplay: string;
}

// Get all team members
export async function getAllTeamMembers(): Promise<TeamMemberWithStatus[]> {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return teamMembers.map(member => ({
      ...member,
      websiteTag: member.website_tag,
      imageUrl: member.image_url,
      statusDisplay: member.status === 'ACTIVE' ? 'Active' : 'Inactive'
    }));
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
}

// Get team member by ID
export async function getTeamMemberById(id: string) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        position: true,
        designation: true,
        website_tag: true,
        bio: true,
        image_url: true,
        email: true,
        linkedin: true,
        twitter: true,
        status: true,
        order: true,
        featured: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!teamMember) {
      throw new Error('Team member not found');
    }

    // Map Prisma field names to TypeScript interface names
    return {
      ...teamMember,
      websiteTag: teamMember.website_tag,
      imageUrl: teamMember.image_url
    };
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw new Error('Failed to fetch team member');
  }
}

// Create new team member
export async function createTeamMember(data: TeamMemberData) {
  try {
    const teamMember = await prisma.teamMember.create({
      data: {
        id: createId(),
        name: data.name,
        position: data.position,
        designation: data.designation,
        website_tag: data.websiteTag,
        bio: data.bio,
        image_url: data.imageUrl,
        email: data.email,
        linkedin: data.linkedin,
        twitter: data.twitter,
        status: data.status || 'ACTIVE',
        order: data.order || 0,
        featured: data.featured || false
      }
    });

    return teamMember;
  } catch (error) {
    console.error('Error creating team member:', error);
    throw new Error('Failed to create team member');
  }
}

// Update team member
export async function updateTeamMember(id: string, data: Partial<TeamMemberData>) {
  try {
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.designation !== undefined && { designation: data.designation }),
        ...(data.websiteTag !== undefined && { website_tag: data.websiteTag }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
        ...(data.twitter !== undefined && { twitter: data.twitter }),
        ...(data.status && { status: data.status }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.featured !== undefined && { featured: data.featured })
      }
    });

    return teamMember;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw new Error('Failed to update team member');
  }
}

// Delete team member
export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw new Error('Failed to delete team member');
  }
}

// Get active team members for public display
export async function getActiveTeamMembers() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching active team members:', error);
    throw new Error('Failed to fetch active team members');
  }
}

// Get featured team members
export async function getFeaturedTeamMembers() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        status: 'ACTIVE',
        featured: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching featured team members:', error);
    throw new Error('Failed to fetch featured team members');
  }
}