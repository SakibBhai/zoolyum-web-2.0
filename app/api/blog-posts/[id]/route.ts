import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blog-posts/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to get by ID first, then by slug
    let blogPost;
    
    // First try to find by ID (string)
    blogPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    // If not found by ID, try to find by slug
    if (!blogPost) {
      blogPost = await prisma.blogPost.findUnique({
        where: { slug: id }
      });
    }
    
    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Format the response to match the expected structure
    const formattedPost = {
      id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      imageUrl: blogPost.imageUrl,
      published: blogPost.published,
      tags: blogPost.tags,
      createdAt: blogPost.createdAt.toISOString(),
      updatedAt: blogPost.updatedAt.toISOString(),
      authorId: blogPost.authorId
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/blog-posts/[id] - Update a specific blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, published, tags } = body;
    
    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // If slug is being updated, check if it's unique
    if (slug && slug !== existingPost.slug) {
      const slugCheck = await prisma.blogPost.findUnique({
        where: { slug }
      });
      
      if (slugCheck && slugCheck.id !== id) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Prepare update data - only include fields that are provided
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (published !== undefined) updateData.published = published;
    if (tags !== undefined) updateData.tags = tags;
    
    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });
    
    // Format the response to match the expected structure
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl,
      published: updatedPost.published,
      tags: updatedPost.tags,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
      authorId: updatedPost.authorId
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/blog-posts/[id] - Delete a specific blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}