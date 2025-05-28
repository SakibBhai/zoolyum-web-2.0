"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/admin/image-uploader"
import { GalleryUploader } from "@/components/admin/gallery-uploader"
import { useToast } from "@/hooks/use-toast"

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic project info
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [client, setClient] = useState("")
  const [year, setYear] = useState("")
  const [duration, setDuration] = useState("")

  // Project content
  const [description, setDescription] = useState("")
  const [overview, setOverview] = useState("")
  const [challenge, setChallenge] = useState("")
  const [solution, setSolution] = useState("")

  // Media
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)

  // Structured data (as JSON strings for the form)
  const [processSteps, setProcessSteps] = useState("")
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string }>>([])
  const [results, setResults] = useState("")
  const [testimonial, setTestimonial] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!title || !slug || !category || !description || !thumbnailUrl) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Parse JSON fields
      let processStepsArray = []
      let resultsArray = []
      let testimonialObj = {}

      try {
        if (processSteps) processStepsArray = JSON.parse(processSteps)
        if (results) resultsArray = JSON.parse(results)
        if (testimonial) testimonialObj = JSON.parse(testimonial)
      } catch (error) {
        toast({
          title: "Invalid JSON format",
          description: "Please check your JSON fields for proper formatting",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Prepare project data
      const projectData = {
        title,
        slug,
        category,
        client,
        year,
        duration,
        description,
        overview,
        challenge,
        solution,
        thumbnail_url: thumbnailUrl,
        hero_image_url: heroImageUrl,
        process: processStepsArray,
        gallery: galleryImages,
        results: resultsArray,
        testimonial: testimonialObj,
      }

      // Submit to API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      })

      // Redirect to projects list
      router.push("/admin/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while creating the project",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Only auto-generate slug if it hasn't been manually edited
    if (
      !slug ||
      slug ===
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
    ) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={handleTitleChange} placeholder="Project Title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="project-slug"
                  required
                />
                <p className="text-sm text-gray-500">Used in the URL: /work/{slug || "project-slug"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Web Design, Branding, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Client Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3 months"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Content</CardTitle>
            <CardDescription>Describe your project in detail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of the project (displayed in project cards)"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview">Project Overview</Label>
              <Textarea
                id="overview"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="A detailed overview of the project"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challenge">The Challenge</Label>
                <Textarea
                  id="challenge"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Describe the challenges faced in this project"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">The Solution</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Describe the solutions implemented"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Upload images for your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploader
              label="Thumbnail Image *"
              initialImageUrl={thumbnailUrl}
              onImageChange={setThumbnailUrl}
              helpText="This image will be displayed in project cards (recommended: 16:9 ratio)"
            />

            <ImageUploader
              label="Hero Image"
              initialImageUrl={heroImageUrl}
              onImageChange={setHeroImageUrl}
              helpText="This image will be displayed at the top of the project detail page"
            />

            <GalleryUploader
              label="Project Gallery"
              initialImages={galleryImages}
              onImagesChange={setGalleryImages}
              helpText="Add images to the project gallery"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Structured Data</CardTitle>
            <CardDescription>Add structured data for your project (in JSON format)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="process">Process Steps (JSON Array)</Label>
              <Textarea
                id="process"
                value={processSteps}
                onChange={(e) => setProcessSteps(e.target.value)}
                placeholder={`[
  { "title": "Research", "description": "Conducted user research..." },
  { "title": "Design", "description": "Created wireframes and mockups..." }
]`}
                rows={6}
              />
              <p className="text-sm text-gray-500">Enter an array of objects with title and description fields</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results (JSON Array)</Label>
              <Textarea
                id="results"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder={`[
  { "metric": "Conversion Rate", "value": "+25%" },
  { "metric": "User Engagement", "value": "2x increase" }
]`}
                rows={6}
              />
              <p className="text-sm text-gray-500">Enter an array of objects with metric and value fields</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">Client Testimonial (JSON Object)</Label>
              <Textarea
                id="testimonial"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder={`{
  "quote": "Working with Sakib was an amazing experience...",
  "author": "John Doe",
  "position": "CEO, Company Name"
}`}
                rows={6}
              />
              <p className="text-sm text-gray-500">Enter an object with quote, author, and position fields</p>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </div>
  )
}
