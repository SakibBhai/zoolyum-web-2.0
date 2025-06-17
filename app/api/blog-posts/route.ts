import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  published: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id?: string;
}

// GET /api/blog-posts - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    const whereClause = published !== null ? { published: published === 'true' } : {};
    
    const blogPosts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const formattedPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      published: post.published,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      authorId: post.authorId
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/blog-posts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, published, tags } = body;
    
    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, excerpt, content' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create the blog post
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl: imageUrl || null,
        published: published || false,
        tags: tags || [],
        authorId: session.user.email
      }
    });
    
    const blogPost = {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      imageUrl: newPost.imageUrl,
      published: newPost.published,
      tags: newPost.tags,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
      authorId: newPost.authorId
    };
    
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return NextResponse.json(
        { error: `Failed to create blog post: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}