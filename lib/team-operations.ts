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
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    behance?: string;
  };
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
        { createdAt: 'desc' }
      ]
    });

    const result = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      position: member.role, // Map role to position
      designation: member.department, // Map department to designation
      websiteTag: member.employee_id, // Map employee_id to websiteTag
      bio: member.bio,
      imageUrl: member.avatar, // Map avatar to imageUrl
      email: member.email,
      linkedin: null, // Not available in current schema
      twitter: null, // Not available in current schema
      status: member.is_active ? 'ACTIVE' : 'INACTIVE',
      order: member.order || 0,
      featured: member.featured || false,
      createdAt: member.createdAt || new Date(),
      updatedAt: member.updatedAt || new Date(),
      statusDisplay: member.is_active ? 'Active' : 'Inactive'
    }));

    console.log('Team members from DB:', result.map(m => ({ name: m.name, featured: m.featured, status: m.status })));
    return result;
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
        role: true,
        department: true,
        bio: true,
        avatar: true,
        email: true,
        phone: true,
        employee_id: true,
        is_active: true,
        featured: true,
        order: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!teamMember) {
      throw new Error('Team member not found');
    }

    // Map Prisma field names to TypeScript interface names
    return {
      id: teamMember.id,
      name: teamMember.name,
      position: teamMember.role, // Map role to position
      designation: teamMember.department, // Map department to designation
      websiteTag: teamMember.employee_id, // Map employee_id to websiteTag
      bio: teamMember.bio,
      imageUrl: teamMember.avatar, // Map avatar to imageUrl
      email: teamMember.email,
      linkedin: null, // Not available in current schema
      twitter: null, // Not available in current schema
      status: teamMember.is_active ? 'ACTIVE' : 'INACTIVE',
      order: teamMember.order || 0,
      featured: teamMember.featured || false,
      createdAt: teamMember.createdAt || new Date(), // Ensure non-null Date
      updatedAt: teamMember.updatedAt || new Date() // Ensure non-null Date
    };
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw new Error('Failed to fetch team member');
  }
}

// Create new team member
export async function createTeamMember(data: TeamMemberData) {
  try {
    console.log('createTeamMember called with data:', JSON.stringify(data, null, 2));

    // Handle email - if not provided or empty, generate a unique one
    const memberEmail = data.email?.trim()
      ? data.email.trim()
      : `${data.name.trim().toLowerCase().replace(/\s+/g, '.')}@${Date.now()}@zoolyum.internal`;

    console.log('Using email:', memberEmail);

    const teamMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.position || 'Team Member', // Map position to role
        department: data.designation || 'General', // Map designation to department
        employee_id: data.websiteTag || createId(), // Map websiteTag to employee_id
        bio: data.bio || '',
        avatar: data.imageUrl || '/placeholder-user.jpg', // Map imageUrl to avatar
        email: memberEmail, // Use the generated/provided email
        phone: null, // Not provided in interface
        is_active: data.status ? data.status === 'ACTIVE' : true, // Map status to is_active boolean
        featured: data.featured || false,
        order: data.order || 0
        // linkedin, twitter are not available in current schema
      }
    });

    console.log('Team member created successfully:', teamMember.id);

    return teamMember;
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to create team member');
  }
}

// Update team member
export async function updateTeamMember(id: string, data: Partial<TeamMemberData>) {
  try {
    console.log('Updating team member with data:', { id, featured: data.featured, order: data.order, status: data.status });

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.position !== undefined && { role: data.position }), // Map position to role
        ...(data.designation !== undefined && { department: data.designation }), // Map designation to department
        ...(data.websiteTag !== undefined && { employee_id: data.websiteTag }), // Map websiteTag to employee_id
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.imageUrl !== undefined && { avatar: data.imageUrl }), // Map imageUrl to avatar
        ...(data.email !== undefined && { email: data.email }),
        // linkedin and twitter are not available in current schema
        ...(data.status && { is_active: data.status === 'ACTIVE' }), // Map ACTIVE to is_active boolean
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.order !== undefined && { order: data.order })
      }
    });

    console.log('Updated team member result:', { id: teamMember.id, featured: teamMember.featured, order: teamMember.order, is_active: teamMember.is_active });
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
        is_active: true
      },
      orderBy: [
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
        is_active: true,
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