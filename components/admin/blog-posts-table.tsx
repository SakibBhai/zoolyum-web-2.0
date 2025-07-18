'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { deleteBlogPostAction, redirectToBlogDashboard } from '@/app/actions/blog-actions';
import { getBlogPosts } from '@/lib/blog-operations';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { BlogListSkeleton } from '@/components/admin/blog-list-skeleton';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string;
  imageUrl?: string;
  content: string;
  author?: string;
  tags?: string[];
}

interface BlogPostsTableProps {
  initialPosts?: BlogPost[];
}

export function BlogPostsTable({ initialPosts }: BlogPostsTableProps = {}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch posts on component mount if no initial posts provided
  useEffect(() => {
    if (!initialPosts) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          setError(null);
          const fetchedPosts = await getBlogPosts();
          setPosts(fetchedPosts);
        } catch (err) {
          setError('Failed to load blog posts');
          console.error('Error fetching posts:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPosts();
    }
  }, [initialPosts]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // React 19 useActionState for delete action
  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (prevState: any, formData: FormData) => {
      const postId = formData.get('postId') as string;
      const result = await deleteBlogPostAction(postId);
      
      if (result.success) {
        setDeleteModalOpen(false);
        setPostToDelete(null);
        // Remove the deleted post from local state
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      }
      
      return result;
    },
    { success: false, message: '' }
  );

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post: BlogPost) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleEdit = (slug: string) => {
    startTransition(() => {
      router.push(`/admin/dashboard/blog/edit/${slug}`);
    });
  };

  const handleView = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const confirmDelete = () => {
    if (postToDelete) {
      startTransition(() => {
        const formData = new FormData();
        formData.append('postId', postToDelete.id);
        deleteAction(formData);
      });
    }
  };

  // Show loading skeleton while fetching data
  if (loading) {
    return <BlogListSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            getBlogPosts()
              .then(setPosts)
              .catch(() => setError('Failed to load blog posts'))
              .finally(() => setLoading(false));
          }}
          className="px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
        <div className="p-4 border-b border-[#333333]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E9E7E2]/50 h-5 w-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#252525]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#E9E7E2]/50 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post: BlogPost) => (
                  <tr key={post.id} className={isPending ? 'opacity-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#E9E7E2]/70">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {post.published ? 'published' : 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#E9E7E2]/70">{formatDate(post.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(post.slug)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View post"
                          disabled={isPending}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(post.slug)}
                          className="p-1 text-[#FF5001] hover:text-[#FF5001]/80 transition-colors"
                          title="Edit post"
                          disabled={isPending}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete post"
                          disabled={isPending || isDeleting}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[#E9E7E2]/50">
                    {searchQuery ? 'No posts found matching your search.' : 'No posts found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
        variant="destructive"
      />

      {/* Error message */}
      {deleteState.message && !deleteState.success && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{deleteState.message}</p>
        </div>
      )}
    </>
  );
}