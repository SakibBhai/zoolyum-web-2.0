"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProjectBySlug, updateProject } from "@/lib/project-operations";
import { PageTransition } from "@/components/page-transition";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Save, X, Loader2 } from "lucide-react";

export default function EditProjectPage() {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    category: "",
    description: "",
    image_url: "",
    image_path: "",
    hero_image_url: "",
    hero_image_path: "",
    year: "",
    client: "",
    duration: "",
    services: "",
    overview: "",
    challenge: "",
    solution: "",
    process: "",
    gallery: "",
    results: "",
    testimonial: "",
    status: "draft",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const project = await fetchProjectBySlug(slug, true);

        // Format JSON fields for display in textarea
        const jsonFields = ["process", "gallery", "results", "testimonial"];
        const formattedProject = { ...project };

        jsonFields.forEach((field) => {
          if (formattedProject[field as keyof typeof formattedProject]) {
            (formattedProject as any)[field] = JSON.stringify(
              formattedProject[field as keyof typeof formattedProject],
              null,
              2
            );
          }
        });

        // Format services array to comma-separated string
        if (Array.isArray((formattedProject as any).services)) {
          (formattedProject as any).services = (
            formattedProject as any
          ).services.join(", ");
        }

        // Map Project interface to formData structure
        const mappedFormData = {
          id: formattedProject.id || "",
          title: formattedProject.title || "",
          slug: formattedProject.slug || "",
          category: (formattedProject as any).category || "",
          description: formattedProject.description || "",
          image_url: (formattedProject as any).imageUrl || "",
          image_path: (formattedProject as any).image_path || "",
          hero_image_url: (formattedProject as any).heroImageUrl || "",
          hero_image_path: (formattedProject as any).hero_image_path || "",
          year: (formattedProject as any).year || "",
          client: (formattedProject as any).client || "",
          duration: (formattedProject as any).duration || "",
          services: (formattedProject as any).services || "",
          overview: (formattedProject as any).overview || "",
          challenge: (formattedProject as any).challenge || "",
          solution: (formattedProject as any).solution || "",
          process: (formattedProject as any).process || "",
          gallery: (formattedProject as any).gallery || "",
          results: (formattedProject as any).results || "",
          testimonial: (formattedProject as any).testimonial || "",
          status: (formattedProject as any).status || "draft",
        };

        setFormData(mappedFormData);
      } catch (error) {
        console.error("Error loading project:", error);
        setError("Failed to load project. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [slug]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Parse JSON fields back to objects
      const jsonFields = ["process", "gallery", "results", "testimonial"];
      const processedData = { ...formData };
      
      jsonFields.forEach((field) => {
        if (processedData[field as keyof typeof processedData]) {
          try {
            (processedData as any)[field] = JSON.parse(
              processedData[field as keyof typeof processedData] as string
            );
          } catch {
            // If parsing fails, keep as string
          }
        }
      });
      
      // Convert services string back to array
      if (processedData.services !== undefined) {
        if (typeof processedData.services === 'string') {
          (processedData as any).services = processedData.services.trim() === '' 
            ? [] 
            : processedData.services
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0);
        } else {
          // If it's already an array or other type, keep it as is
          (processedData as any).services = processedData.services || [];
        }
      } else {
        // If services is undefined, set to empty array
        (processedData as any).services = [];
      }
      
      // Map form data to API format
      const updateData = {
        title: processedData.title,
        slug: processedData.slug,
        description: processedData.description,
        category: processedData.category,
        imageUrl: processedData.image_url,
        heroImageUrl: processedData.hero_image_url,
        year: processedData.year,
        client: processedData.client,
        duration: processedData.duration,
        services: (processedData as any).services,
        overview: processedData.overview,
        challenge: processedData.challenge,
        solution: processedData.solution,
        process: (processedData as any).process,
        gallery: (processedData as any).gallery,
        results: (processedData as any).results,
        testimonial: (processedData as any).testimonial,
        published: processedData.status === "published"
      };
      
      await updateProject(formData.id, updateData);
      router.push("/admin/dashboard/projects");
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the project");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/projects");
  };

  const handleThumbnailUploaded = (url: string, path: string) => {
    setFormData({
      ...formData,
      image_url: url,
      image_path: path,
    });
  };

  const handleThumbnailRemoved = () => {
    setFormData({
      ...formData,
      image_url: "",
      image_path: "",
    });
  };

  const handleHeroImageUploaded = (url: string, path: string) => {
    setFormData({
      ...formData,
      hero_image_url: url,
      hero_image_path: path,
    });
  };

  const handleHeroImageRemoved = () => {
    setFormData({
      ...formData,
      hero_image_url: "",
      hero_image_path: "",
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5001]" />
          <span className="ml-2">Loading project...</span>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#333333] rounded-lg text-[#E9E7E2]/70 hover:bg-[#252525] transition-colors flex items-center"
              disabled={isSubmitting}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors flex items-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6"
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
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Project title"
                required
              />
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
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="project-slug"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Brand Strategy, Digital Strategy, etc."
              />
            </div>
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium mb-2"
              >
                Client
              </label>
              <input
                id="client"
                name="client"
                type="text"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Client name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-2">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="2023"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium mb-2"
              >
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="3 months"
              />
            </div>
            <div>
              <label
                htmlFor="services"
                className="block text-sm font-medium mb-2"
              >
                Services (comma separated)
              </label>
              <input
                id="services"
                name="services"
                type="text"
                value={formData.services}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Brand Strategy, Visual Identity, etc."
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              placeholder="Brief description of the project"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail Image
              </label>
              <ImageUploader
                label="Thumbnail Image"
                initialImageUrl={formData.image_url}
                onImageChangeAction={(url) =>
                  handleInputChange("image_url", url || "")
                }
                folder="thumbnails"
                helpText="Upload a thumbnail image for the project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Image
              </label>
              <ImageUploader
                label="Hero Image"
                initialImageUrl={formData.hero_image_url}
                onImageChangeAction={(url) =>
                  handleInputChange("hero_image_url", url || "")
                }
                folder="hero-images"
                helpText="Upload a hero image for the project"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="overview"
              className="block text-sm font-medium mb-2"
            >
              Project Overview
            </label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
              placeholder="Detailed overview of the project"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="challenge"
                className="block text-sm font-medium mb-2"
              >
                The Challenge
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Description of the challenge"
              />
            </div>
            <div>
              <label
                htmlFor="solution"
                className="block text-sm font-medium mb-2"
              >
                The Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2]"
                placeholder="Description of the solution"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="process" className="block text-sm font-medium mb-2">
              Process (JSON Array)
            </label>
            <textarea
              id="process"
              name="process"
              value={formData.process}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] font-mono text-sm"
              placeholder='[{"title": "Step 1", "description": "Description of step 1"}]'
            />
            <p className="mt-1 text-xs text-[#E9E7E2]/50">
              JSON array of process steps with title and description properties
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="gallery" className="block text-sm font-medium mb-2">
              Gallery (JSON Array)
            </label>
            <textarea
              id="gallery"
              name="gallery"
              value={formData.gallery}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] font-mono text-sm"
              placeholder='[{"src": "/image.jpg", "alt": "Image description"}]'
            />
            <p className="mt-1 text-xs text-[#E9E7E2]/50">
              JSON array of gallery images with src and alt properties
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="results" className="block text-sm font-medium mb-2">
              Results (JSON Array)
            </label>
            <textarea
              id="results"
              name="results"
              value={formData.results}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] font-mono text-sm"
              placeholder='[{"stat": "42%", "title": "Increase", "description": "Description"}]'
            />
            <p className="mt-1 text-xs text-[#E9E7E2]/50">
              JSON array of results with stat, title, and description properties
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="testimonial"
              className="block text-sm font-medium mb-2"
            >
              Testimonial (JSON Object)
            </label>
            <textarea
              id="testimonial"
              name="testimonial"
              value={formData.testimonial}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] font-mono text-sm"
              placeholder='{"quote": "Great work!", "author": "Client Name", "position": "CEO, Company"}'
            />
            <p className="mt-1 text-xs text-[#E9E7E2]/50">
              JSON object with quote, author, and position properties
            </p>
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
