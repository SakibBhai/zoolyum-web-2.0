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
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: string;
  imageUrl?: string;
  heroImageUrl?: string;
  year?: string;
  client?: string;
  duration?: string;
  services?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  process?: ProcessStep[];
  gallery?: GalleryImage[];
  results?: Result[];
  testimonial?: Testimonial;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: string;
  imageUrl?: string;
  heroImageUrl?: string;
  year?: string;
  client?: string;
  duration?: string;
  services?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  process?: ProcessStep[];
  gallery?: GalleryImage[];
  results?: Result[];
  testimonial?: Testimonial;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  published?: boolean;
  featured?: boolean;
  order?: number;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Fetch all projects
export async function fetchProjects(params?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
}): Promise<Project[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.published !== undefined) {
      searchParams.append('published', params.published.toString());
    }
    if (params?.featured !== undefined) {
      searchParams.append('featured', params.featured.toString());
    }
    if (params?.category) {
      searchParams.append('category', params.category);
    }

    const url = `/api/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Fetch a single project by ID
export async function fetchProject(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

// Fetch a single project by slug
export async function fetchProjectBySlug(slug: string, isAdmin: boolean = false): Promise<Project | null> {
  try {
    const url = `/api/projects/slug/${slug}${isAdmin ? '?admin=true' : ''}`;
    const response = await fetch(url);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw error;
  }
}

// Create a new project
export async function createProject(data: CreateProjectData): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(id: string, data: UpdateProjectData): Promise<Project> {
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
    
    return await response.json();
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