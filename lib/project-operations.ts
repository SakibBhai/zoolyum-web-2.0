// Project operations for admin dashboard

export interface ProcessStep {
  title: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface Result {
  metric: string;
  value: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  position: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  status: string | null;
  priority: string | null;
  type: string | null;
  start_date: Date | null;
  end_date: Date | null;
  budget: number | null;
  estimated_budget: number | null;
  actual_budget: number | null;
  progress: number | null;
  manager: string | null;
  created_by: string | null;
  tasks_total: number | null;
  tasks_completed: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Project interface now matches database schema directly
export interface ProjectWithComputed extends Project {}

// Helper function to add computed fields to a project (no longer needed but kept for compatibility)
export function addComputedFields(project: Project): ProjectWithComputed {
  return project;
}

// Helper function to add computed fields to multiple projects (no longer needed but kept for compatibility)
export function addComputedFieldsToArray(projects: Project[]): ProjectWithComputed[] {
  return projects;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  client_id?: string;
  status?: string;
  priority?: string;
  type?: string;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  estimated_budget?: number;
  actual_budget?: number;
  progress?: number;
  manager?: string;
  created_by?: string;
  tasks_total?: number;
  tasks_completed?: number;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Fetch all projects with optional filtering
export async function fetchProjects(params?: {
  status?: string;
  type?: string;
  limit?: number;
}): Promise<ProjectWithComputed[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    
    if (params?.type) {
      searchParams.append('type', params.type);
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    
    const url = `/api/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const projects: Project[] = await response.json();
    return addComputedFieldsToArray(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Fetch a single project by ID
export async function fetchProject(id: string): Promise<ProjectWithComputed | null> {
  try {
    const response = await fetch(`/api/projects/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    const project: Project = await response.json();
    return addComputedFields(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

// Helper function to generate URL-friendly slug from project title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to get project title from slug
export function getTitleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ');
}

// Fetch a single project by slug (using name)
export async function fetchProjectBySlug(slug: string, isAdmin: boolean = false): Promise<ProjectWithComputed | null> {
  try {
    const url = `/api/projects/slug/${slug}${isAdmin ? '?admin=true' : ''}`;
    const response = await fetch(url);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    const project: Project = await response.json();
    return addComputedFields(project);
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw error;
  }
}

// Fetch a single project by name
export async function fetchProjectByName(name: string, isAdmin: boolean = false): Promise<ProjectWithComputed | null> {
  const projects = await fetchProjects({ status: isAdmin ? undefined : 'active' });
  const project = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
  return project || null;
}

// Create a new project
export async function createProject(data: CreateProjectData): Promise<ProjectWithComputed> {
  try {
    // Generate slug if not provided
    const projectData = {
      ...data,
      slug: data.slug || generateSlug(data.title),
      services: data.services || [],
      process: data.process || [],
      gallery: data.gallery || [],
      results: data.results || [],
      technologies: data.technologies || [],
      published: data.published ?? false,
      featured: data.featured ?? false,
    };

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }
    
    const project: Project = await response.json();
    return addComputedFields(project);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(id: string, data: UpdateProjectData): Promise<ProjectWithComputed> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }
    
    const project: Project = await response.json();
    return addComputedFields(project);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}