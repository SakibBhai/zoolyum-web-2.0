'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/stack-auth';

const prisma = new PrismaClient();

export interface BlogActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// Create blog post server action
export async function createBlogPostAction(
  prevState: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized. Please log in to create a blog post.',
      };
    }

    // Extract and validate form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const published = formData.get('published') === 'true';
    const tagsString = formData.get('tags') as string;
    
    // Basic validation
    const errors: Record<string, string[]> = {};
    
    if (!title?.trim()) {
      errors.title = ['Title is required'];
    }
    
    if (!slug?.trim()) {
      errors.slug = ['Slug is required'];
    }
    
    if (!content?.trim()) {
      errors.content = ['Content is required'];
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please fix the validation errors.',
        errors,
      };
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      return {
        success: false,
        message: 'A blog post with this slug already exists.',
        errors: { slug: ['This slug is already taken'] }
      };
    }

    // Parse tags
    const tags = tagsString
      ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    // Create the blog post
    await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        imageUrl: imageUrl?.trim() || null,
        published,
        tags,
        authorId: user.id,
      },
    });

    // Revalidate the blog posts cache
    revalidateTag('blog-posts');
    revalidatePath('/admin/dashboard/blog');
    
    return {
      success: true,
      message: 'Blog post created successfully!',
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Update blog post server action
export async function updateBlogPostAction(
  id: string,
  prevState: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized. Please log in to update the blog post.',
      };
    }

    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return {
        success: false,
        message: 'Blog post not found.',
      };
    }

    // Extract form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const published = formData.get('published') === 'true';
    const tagsString = formData.get('tags') as string;
    
    // Basic validation
    const errors: Record<string, string[]> = {};
    
    if (!title?.trim()) {
      errors.title = ['Title is required'];
    }
    
    if (!slug?.trim()) {
      errors.slug = ['Slug is required'];
    }
    
    if (!content?.trim()) {
      errors.content = ['Content is required'];
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please fix the validation errors.',
        errors,
      };
    }

    // Check if slug is unique (excluding current post)
    if (slug !== existingPost.slug) {
      const slugCheck = await prisma.blogPost.findUnique({
        where: { slug }
      });
      
      if (slugCheck && slugCheck.id !== id) {
        return {
          success: false,
          message: 'A blog post with this slug already exists.',
          errors: { slug: ['This slug is already taken'] }
        };
      }
    }

    // Parse tags
    const tags = tagsString
      ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    // Update the blog post
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        imageUrl: imageUrl?.trim() || null,
        published,
        tags,
      },
    });

    // Revalidate the blog posts cache
    revalidateTag('blog-posts');
    revalidatePath('/admin/dashboard/blog');
    revalidatePath(`/admin/dashboard/blog/edit/${slug}`);
    
    return {
      success: true,
      message: 'Blog post updated successfully!',
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete blog post server action
export async function deleteBlogPostAction(
  id: string
): Promise<BlogActionState> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized. Please log in to delete the blog post.',
      };
    }

    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return {
        success: false,
        message: 'Blog post not found.',
      };
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id }
    });

    // Revalidate the blog posts cache
    revalidateTag('blog-posts');
    revalidatePath('/admin/dashboard/blog');
    
    return {
      success: true,
      message: 'Blog post deleted successfully!',
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Redirect after successful operations
export async function redirectToBlogDashboard() {
  redirect('/admin/dashboard/blog');
}