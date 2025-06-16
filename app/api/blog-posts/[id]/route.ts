import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/postgres';

// GET /api/blog-posts/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try to get by ID first, then by slug
    let result;
    if (isNaN(Number(id))) {
      // If id is not a number, treat it as a slug
      result = await pool.query(
        'SELECT * FROM blog_posts WHERE slug = $1',
        [id]
      );
    } else {
      // If id is a number, treat it as an ID
      result = await pool.query(
        'SELECT * FROM blog_posts WHERE id = $1',
        [parseInt(id)]
      );
    }
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    const post = result.rows[0];
    
    const blogPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.image_url,
      published: post.published,
      tags: JSON.parse(post.tags || '[]'),
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      authorId: post.author_id
    };
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog-posts/[id] - Update a specific blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await request.json();
    const { title, slug, excerpt, content, imageUrl, published, tags } = body;
    
    // Check if the blog post exists
    const existingPost = await pool.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [parseInt(id)]
    );
    
    if (existingPost.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // If slug is being updated, check if it's unique
    if (slug && slug !== existingPost.rows[0].slug) {
      const slugCheck = await pool.query(
        'SELECT id FROM blog_posts WHERE slug = $1 AND id != $2',
        [slug, parseInt(id)]
      );
      
      if (slugCheck.rows.length > 0) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the blog post
    const result = await pool.query(
      `UPDATE blog_posts 
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           excerpt = COALESCE($3, excerpt),
           content = COALESCE($4, content),
           image_url = COALESCE($5, image_url),
           published = COALESCE($6, published),
           tags = COALESCE($7, tags)
       WHERE id = $8
       RETURNING *`,
      [
        title,
        slug,
        excerpt,
        content,
        imageUrl,
        published,
        JSON.stringify(tags),
        parseInt(id)
      ]
    );
    
    const updatedPost = result.rows[0];
    
    const blogPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      imageUrl: updatedPost.image_url,
      published: updatedPost.published,
      tags: JSON.parse(updatedPost.tags || '[]'),
      createdAt: updatedPost.created_at,
      updatedAt: updatedPost.updated_at,
      authorId: updatedPost.author_id
    };
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog-posts/[id] - Delete a specific blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Check if the blog post exists
    const existingPost = await pool.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [parseInt(id)]
    );
    
    if (existingPost.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete the blog post
    await pool.query(
      'DELETE FROM blog_posts WHERE id = $1',
      [parseInt(id)]
    );
    
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
  }
}