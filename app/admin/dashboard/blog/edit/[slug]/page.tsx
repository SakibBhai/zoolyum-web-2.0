"use client";

import type React from "react";

import { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useConditionalUser } from "@/hooks/use-conditional-user";
import { getBlogPostBySlug } from "@/lib/blog-operations";
import { updateBlogPostAction, redirectToBlogDashboard } from "@/app/actions/blog-actions";
import { PageTransition } from "@/components/page-transition";
import { Save, X, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { useToast } from "@/hooks/use-toast";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = useConditionalUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: "", // Change id to string
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    tags: "", // Ensure tags is a string for form input
    status: "draft",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // React 19 useActionState for update action
  const [updateState, updateAction, isUpdating] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateBlogPostAction(formData.get('id') as string, prevState, formData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh and redirect after successful update
        startTransition(() => {
          router.refresh();
          router.push('/admin/dashboard/blog');
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      
      return result;
    },
    { success: false, message: '', errors: {} }
  );

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const { slug } = await params;
        const post = await getBlogPostBySlug(slug);

        if (!post) {
          throw new Error("Blog post not found");
        }

        // Format tags if they're an array
        let formattedTags = post.tags || "";
        if (Array.isArray(post.tags)) {
          formattedTags = post.tags.join(", ");
        }

        setFormData({
          id: String(post.id), // Convert id to string
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          image_url: post.imageUrl || "",
          tags: typeof formattedTags === "string" ? formattedTags : "", // Ensure tags is always a string
          status: post.published ? "published" : "draft",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load blog post");
        toast({
          title: "Error",
          description: err.message || "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params, toast]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    });
  };

  const handleImageChange = (url: string | null) => {
    setFormData({
      ...formData,
      image_url: url || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to update a post");
      toast({
        title: "Error",
        description: "You must be logged in to update a post",
        variant: "destructive",
      });
      return;
    }

    // Create FormData for server action
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('id', formData.id);
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('slug', formData.slug);
    formDataToSubmit.append('excerpt', formData.excerpt);
    formDataToSubmit.append('content', formData.content);
    formDataToSubmit.append('imageUrl', formData.image_url);
    formDataToSubmit.append('published', formData.status === 'published' ? 'true' : 'false');
    formDataToSubmit.append('tags', formData.tags);

    // Call server action
    updateAction(formDataToSubmit);
  };

  const handleCancel = () => {
    startTransition(() => {
      router.push("/admin/dashboard/blog");
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5001]" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#333333] rounded-lg text-[#E9E7E2]/70 hover:bg-[#252525] transition-colors flex items-center"
              disabled={isUpdating || isPending}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors flex items-center disabled:opacity-50"
              disabled={isUpdating || isPending}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        {updateState.message && !updateState.success && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
            {updateState.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 ${
            isUpdating || isPending ? 'opacity-75 pointer-events-none' : ''
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#252525] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] ${
                  updateState.errors?.title ? 'border-red-500' : 'border-[#333333]'
                }`}
                placeholder="Post title"
                required
              />
              {updateState.errors?.title && (
                <p className="mt-1 text-sm text-red-400">{updateState.errors.title[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#252525] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] ${
                  updateState.errors?.slug ? 'border-red-500' : 'border-[#333333]'
                }`}
                placeholder="post-slug"
                required
              />
              {updateState.errors?.slug && (
                <p className="mt-1 text-sm text-red-400">{updateState.errors.slug[0]}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className={`w-full px-4 py-3 bg-[#252525] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] ${
                updateState.errors?.excerpt ? 'border-red-500' : 'border-[#333333]'
              }`}
              placeholder="Brief description of the post"
              required
            />
            {updateState.errors?.excerpt && (
              <p className="mt-1 text-sm text-red-400">{updateState.errors.excerpt[0]}</p>
            )}
          </div>

          <div className="mb-6">
            <ImageUploader
              label="Featured Image"
              initialImageUrl={formData.image_url}
              onImageChangeAction={handleImageChange}
              helpText="Upload a featured image for your blog post (16:9 ratio recommended)"
            />
            {updateState.errors?.imageUrl && (
              <p className="mt-1 text-sm text-red-400">{updateState.errors.imageUrl[0]}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChangeAction={handleContentChange}
              placeholder="Write your post content here..."
              minHeight="400px"
            />
            {updateState.errors?.content && (
              <p className="mt-1 text-sm text-red-400">{updateState.errors.content[0]}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              placeholder="Brand Strategy, Marketing, Design"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-1/3 px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
