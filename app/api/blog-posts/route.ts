import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/postgres';

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
    
    let query = 'SELECT * FROM blog_posts';
    const params: any[] = [];
    
    if (published !== null) {
      query += ' WHERE published = $1';
      params.push(published === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    const blogPosts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      imageUrl: row.image_url,
      published: row.published,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      authorId: row.author_id
    }));
    
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
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
    const existingPost = await pool.query(
      'SELECT id FROM blog_posts WHERE slug = $1',
      [slug]
    );
    
    if (existingPost.rows.length > 0) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create the blog post
    const result = await pool.query(
      `INSERT INTO blog_posts 
       (title, slug, excerpt, content, image_url, published, tags, author_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        title,
        slug,
        excerpt,
        content,
        imageUrl || null,
        published || false,
        JSON.stringify(tags || []),
        session.user.email
      ]
    );
    
    const newPost = result.rows[0];
    
    const blogPost = {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      imageUrl: newPost.image_url,
      published: newPost.published,
      tags: JSON.parse(newPost.tags || '[]'),
      createdAt: newPost.created_at,
      updatedAt: newPost.updated_at,
      authorId: newPost.author_id
    };
    
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}