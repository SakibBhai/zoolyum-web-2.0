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
  image_url?: string | null;
  hero_image_url?: string | null;
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
  // Additional properties for portfolio projects
  slug?: string;
  title?: string;
  services?: string[];
  process?: ProcessStep[];
  gallery?: GalleryImage[];
  results?: Result[];
  technologies?: string[];
  published?: boolean;
  featured?: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Enhanced error types for better error handling
interface FetchError extends Error {
  status?: number;
  statusText?: string;
  isNetworkError?: boolean;
}

// Retry utility function
async function retryFetch(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Response> {
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      // Return successful responses immediately
      if (response.ok) {
        return response;
      }
      
      // Don't retry client errors (4xx), only server errors (5xx) and network issues
      if (response.status >= 400 && response.status < 500) {
        // For 404, return the response for caller to handle
        if (response.status === 404) {
          return response;
        }
        const error: FetchError = new Error(`Client error: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }
      
      // For server errors, create error but continue to retry
      const error: FetchError = new Error(`Server error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      lastError = error;
      
    } catch (error: unknown) {
      // Network errors (fetch failures)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (error instanceof TypeError || errorMessage.includes('fetch')) {
        const networkError: FetchError = new Error(`Network error: ${errorMessage}`);
        networkError.isNetworkError = true;
        lastError = networkError;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    // Wait before retrying (except on last attempt)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
}

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
    
    // Use retry logic for robust fetching
    const response = await retryFetch(url, {}, 3, 1000);
    
    // Validate response content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response format: expected JSON, got ${contentType}`);
    }
    
    let projects: Project[];
    try {
      projects = await response.json();
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Failed to parse response JSON: ${errorMessage}`);
    }
    
    // Validate response data structure
    if (!Array.isArray(projects)) {
      throw new Error('Invalid response: expected array of projects');
    }
    
    // Additional validation for empty or invalid data
    if (projects.length === 0) {
      console.warn('No projects returned from API');
    }
    
    // Validate each project has required fields
    const validatedProjects = projects.filter(project => {
      if (!project || typeof project !== 'object') {
        console.warn('Invalid project object found, skipping:', project);
        return false;
      }
      if (!project.id || !project.name) {
        console.warn('Project missing required fields (id, name), skipping:', project);
        return false;
      }
      return true;
    });
    
    if (validatedProjects.length !== projects.length) {
      console.warn(`Filtered out ${projects.length - validatedProjects.length} invalid projects`);
    }
    
    return addComputedFieldsToArray(validatedProjects);
    
  } catch (error) {
    const fetchError = error as FetchError;
    
    // Enhanced error logging with context
    console.error('Error fetching projects:', {
      message: fetchError.message,
      status: fetchError.status,
      statusText: fetchError.statusText,
      isNetworkError: fetchError.isNetworkError,
      params,
      timestamp: new Date().toISOString()
    });
    
    // Provide user-friendly error messages
    if (fetchError.isNetworkError) {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    
    if (fetchError.status === 404) {
      throw new Error('Projects endpoint not found. Please contact support.');
    }
    
    if (fetchError.status === 403) {
      throw new Error('Access denied. Please check your permissions.');
    }
    
    if (fetchError.status === 500) {
      throw new Error('Server error occurred. Please try again later.');
    }
    
    if (fetchError.status && fetchError.status >= 400) {
      throw new Error(`Request failed with status ${fetchError.status}: ${fetchError.statusText}`);
    }
    
    // Re-throw with original message for unexpected errors
    throw new Error(`Failed to fetch projects: ${fetchError.message}`);
  }
}

// Fetch a single project by ID
export async function fetchProject(id: string): Promise<ProjectWithComputed | null> {
  try {
    // Use retry logic for robust fetching, but handle 404s specially
    const response = await retryFetch(`/api/projects/${id}`, {}, 3, 1000);
    
    // Handle 404 - project not found
    if (response.status === 404) {
      return null;
    }
    
    // Validate response content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response format: expected JSON, got ${contentType}`);
    }
    
    const project: Project = await response.json();
    return addComputedFields(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    // If it's a 404 error, return null instead of throwing
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
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
      slug: data.slug || generateSlug(data.title || data.name || 'untitled-project'),
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