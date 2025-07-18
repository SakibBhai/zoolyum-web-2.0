'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { X, Plus } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'

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

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newService, setNewService] = useState('')
  const [newTechnology, setNewTechnology] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  
  // Debug: Log when component mounts
  console.log('NewProjectPage component mounted')

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
    console.log('Form submission started with data:', data)
    setIsSubmitting(true)
    setErrors([])
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'slug', 'description', 'category']
      const missingFields = requiredFields.filter(field => {
        const value = data[field as keyof ProjectFormValues]
        return !value || (typeof value === 'string' && value.trim() === '')
      })
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields)
        setErrors([`Missing required fields: ${missingFields.join(', ')}`])
        toast({
          title: 'Validation Error',
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
          variant: 'destructive',
        })
        return
      }

      console.log('Sending request to /api/projects with data:', data)
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        console.log('Request failed with status:', response.status, 'Error:', result)
        if (response.status === 409) {
          setErrors(['A project with this slug already exists'])
          form.setError('slug', { message: 'This slug is already taken' })
        } else if (response.status === 400) {
          setErrors([result.error || 'Invalid data provided'])
        } else {
          setErrors(['Failed to create project. Please try again.'])
        }
        
        toast({
          title: 'Error',
          description: result.error || 'Failed to create project. Please try again.',
          variant: 'destructive',
        })
        return
      }

      console.log('Project created successfully:', result)
      toast({
        title: 'Success!',
        description: 'Your project has been created successfully.',
      })
      
      router.push('/admin/dashboard/projects')
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      setErrors(['Network error. Please check your connection and try again.'])
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Add a new project to your portfolio
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={(e) => {
          console.log('Form onSubmit event triggered', e)
          e.preventDefault()
          form.handleSubmit(onSubmit)(e)
        }} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Project title" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e)
                          // Auto-generate slug if slug is empty
                          if (!form.getValues('slug')) {
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
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="project-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Web Development" {...field} />
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
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
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
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used in project listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/hero.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Large image for project detail page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Description</h2>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Used in project listings and previews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed project overview"
                      className="min-h-[150px]"
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
                  <FormLabel>Challenge</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What challenges did this project solve?"
                      className="min-h-[120px]"
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
                  <FormLabel>Solution</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did you solve the challenges?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed project content (supports markdown)"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of the project. Supports markdown formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Services</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a service (e.g., UI/UX Design)"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <Button type="button" onClick={addService} variant="outline">
                  Add
                </Button>
              </div>
              {form.watch('services').length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch('services').map((service, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Technologies</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a technology (e.g., React, Node.js)"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology} variant="outline">
                  Add
                </Button>
              </div>
              {form.watch('technologies').length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch('technologies').map((tech, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://project-demo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Live demo or project website
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Source code repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Settings</h2>
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Highlight this project on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log('Current form values:', form.getValues())
                console.log('Form errors:', form.formState.errors)
                console.log('Form is valid:', form.formState.isValid)
              }}
            >
              Debug Form
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                console.log('Testing form submission with minimal data')
                form.setValue('title', 'Test Project')
                form.setValue('slug', 'test-project')
                form.setValue('description', 'This is a test project description with enough characters')
                form.setValue('category', 'Test Category')
                console.log('Form values set, triggering submit')
                form.handleSubmit(onSubmit)()
              }}
            >
              Test Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              onClick={(e) => {
                console.log('Submit button clicked', e)
                console.log('Button type:', e.currentTarget.type)
                console.log('Form element:', e.currentTarget.form)
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}