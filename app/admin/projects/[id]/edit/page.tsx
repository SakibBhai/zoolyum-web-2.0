'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { X, Plus, ArrowLeft } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import Link from 'next/link'

const projectFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title must be less than 100 characters' }),
  slug: z.string()
    .min(1, { message: 'Slug is required' })
    .max(50, { message: 'Slug must be less than 50 characters' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' }),
  description: z.string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(500, { message: 'Description must be less than 500 characters' }),
  content: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  imageUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
  heroImageUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
  year: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  services: z.array(z.string()).default([]),
  overview: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  projectUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
  githubUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().min(0).default(0),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newService, setNewService] = useState('')
  const [newTechnology, setNewTechnology] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      category: '',
      imageUrl: '',
      heroImageUrl: '',
      year: '',
      client: '',
      duration: '',
      services: [],
      overview: '',
      challenge: '',
      solution: '',
      technologies: [],
      projectUrl: '',
      githubUrl: '',
      published: false,
      featured: false,
      order: 0,
    },
  })

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error('Failed to load project')
        }
        const project = await response.json()
        
        // Reset form with project data
        form.reset({
          title: project.title || '',
          slug: project.slug || '',
          description: project.overview || '',
          content: project.content || '',
          category: project.category || '',
          imageUrl: project.imageUrl || '',
          heroImageUrl: project.heroImageUrl || '',
          year: project.year || '',
          client: project.client || '',
          duration: project.duration || '',
          services: project.services || [],
          overview: project.overview || '',
          challenge: project.challenge || '',
          solution: project.solution || '',
          technologies: project.technologies || [],
          projectUrl: project.projectUrl || '',
          githubUrl: project.githubUrl || '',
          published: project.published || false,
          featured: project.featured || false,
          order: project.order || 0,
        })
      } catch (error) {
        console.error('Error loading project:', error)
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive',
        })
        router.push('/admin/projects')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId, form, router])

  // Helper functions for managing arrays
  const addService = () => {
    if (newService.trim() && !form.getValues('services').includes(newService.trim())) {
      const currentServices = form.getValues('services')
      form.setValue('services', [...currentServices, newService.trim()])
      setNewService('')
    }
  }

  const removeService = (serviceToRemove: string) => {
    const currentServices = form.getValues('services')
    form.setValue('services', currentServices.filter(service => service !== serviceToRemove))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !form.getValues('technologies').includes(newTechnology.trim())) {
      const currentTechnologies = form.getValues('technologies')
      form.setValue('technologies', [...currentTechnologies, newTechnology.trim()])
      setNewTechnology('')
    }
  }

  const removeTechnology = (technologyToRemove: string) => {
    const currentTechnologies = form.getValues('technologies')
    form.setValue('technologies', currentTechnologies.filter(tech => tech !== technologyToRemove))
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true)
    setErrors([])
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors(['A project with this slug already exists'])
          form.setError('slug', { message: 'This slug is already taken' })
        } else if (response.status === 400) {
          setErrors([result.error || 'Invalid data provided'])
        } else {
          setErrors(['Failed to update project. Please try again.'])
        }
        
        toast({
          title: 'Error',
          description: result.error || 'Failed to update project. Please try again.',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success!',
        description: 'Your project has been updated successfully.',
      })
      
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error updating project:', error)
      setErrors(['An unexpected error occurred. Please try again.'])
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E9E7E2]">Edit Project</h1>
            <p className="text-[#E9E7E2]/60 mt-1">Update your project details and content</p>
          </div>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-red-400 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#E9E7E2]">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project title" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            // Auto-generate slug if it's empty or matches the previous title
                            const currentSlug = form.getValues('slug')
                            if (!currentSlug || currentSlug === generateSlug(field.value)) {
                              form.setValue('slug', generateSlug(e.target.value))
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Slug *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="project-slug" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[#E9E7E2]/60">
                        URL-friendly version of the title (lowercase, hyphens only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E9E7E2]">Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the project"
                        className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[#E9E7E2]/60">
                      A short description that will appear in project listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Category *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Web Development" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Year</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="2024" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Client</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Client name" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E9E7E2]">Services</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a service"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                />
                <Button type="button" onClick={addService} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('services').map((service, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#333333] text-[#E9E7E2]">
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E9E7E2]">Technologies</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                />
                <Button type="button" onClick={addTechnology} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('technologies').map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#333333] text-[#E9E7E2]">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#E9E7E2]">URLs & Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Thumbnail Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="heroImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Hero Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/hero.jpg" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="projectUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Live Project URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://project-demo.com" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">GitHub URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/user/repo" 
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#E9E7E2]">Content Sections</h3>
              
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E9E7E2]">Overview</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Project overview and goals"
                        className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="challenge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E9E7E2]">Challenge</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What challenges did this project solve?"
                        className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E9E7E2]">Solution</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How did you solve the challenges?"
                        className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#E9E7E2]">Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-[#333333] data-[state=checked]:bg-[#FF5001] data-[state=checked]:border-[#FF5001]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-[#E9E7E2]">Published</FormLabel>
                        <FormDescription className="text-[#E9E7E2]/60">
                          Make this project visible to the public
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-[#333333] data-[state=checked]:bg-[#FF5001] data-[state=checked]:border-[#FF5001]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-[#E9E7E2]">Featured</FormLabel>
                        <FormDescription className="text-[#E9E7E2]/60">
                          Highlight this project in featured sections
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E9E7E2]">Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2]"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-[#E9E7E2]/60">
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#FF5001] hover:bg-[#FF5001]/90"
              >
                {isSubmitting ? 'Updating...' : 'Update Project'}
              </Button>
              
              <Link href="/admin/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </PageTransition>
  )
}