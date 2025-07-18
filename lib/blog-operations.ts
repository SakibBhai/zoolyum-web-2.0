// Blog operations for admin dashboard

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface CreateBlogPostData {
  imageUrl: any;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  author?: string;
  tags?: string[];
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

// Fetch all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog-posts');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const posts = await response.json();
    return posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: post.authorId,
      tags: post.tags,
      imageUrl: post.imageUrl
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog-posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch blog post');
    }
    const post = await response.json();
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: post.authorId,
      tags: post.tags,
      imageUrl: post.imageUrl
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
}

// Create a new blog post
export async function createBlogPost(data: CreateBlogPostData): Promise<BlogPost> {
  try {
    const response = await fetch('/api/blog-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        imageUrl: data.imageUrl,
        published: data.published,
        tags: data.tags
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create blog post');
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
}

// Update an existing blog post
export async function updateBlogPost(data: UpdateBlogPostData): Promise<BlogPost> {
  try {
    const response = await fetch(`/api/blog-posts/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        imageUrl: data.imageUrl,
        published: data.published,
        tags: data.tags
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update blog post');
    }
    
    const post = await response.json();
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      author: post.authorId,
      tags: post.tags,
      imageUrl: post.imageUrl
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/blog-posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete blog post');
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post');
  }
}