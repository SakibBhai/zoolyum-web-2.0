// Service operations for CRUD management

export interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceData {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  icon?: string;
  featured?: boolean;
  order?: number;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string;
}

/**
 * Fetch all services
 */
export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await fetch('/api/services');
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
}

/**
 * Fetch a single service by ID
 */
export async function fetchService(id: string): Promise<Service | null> {
  try {
    const response = await fetch(`/api/services/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    throw new Error('Failed to fetch service');
  }
}

/**
 * Fetch a single service by slug
 */
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await fetch(`/api/services/slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    throw new Error('Failed to fetch service');
  }
}

/**
 * Create a new service
 */
export async function createService(data: CreateServiceData): Promise<Service> {
  try {
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create service');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Failed to create service');
  }
}

/**
 * Update an existing service
 */
export async function updateService(data: UpdateServiceData): Promise<Service> {
  try {
    const response = await fetch(`/api/services/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update service');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Failed to update service');
  }
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete service');
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Failed to delete service');
  }
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Validate service data
 */
export function validateServiceData(data: CreateServiceData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push('Slug is required');
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }

  if (data.imageUrl && data.imageUrl.trim().length > 0) {
    try {
      new URL(data.imageUrl);
    } catch {
      errors.push('Image URL must be a valid URL');
    }
  }

  if (data.order !== undefined && data.order < 0) {
    errors.push('Order must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}