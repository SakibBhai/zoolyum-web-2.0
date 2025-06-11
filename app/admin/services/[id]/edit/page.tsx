'use client'

import { useState, useEffect } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUploader } from '@/components/admin/image-uploader'
import { fetchService, updateService, generateSlug, type Service } from '@/lib/service-operations'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

const serviceFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  icon: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().min(0, { message: 'Order must be a non-negative number' }).default(0),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

interface EditServicePageProps {
  params: {
    id: string
  }
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      imageUrl: '',
      icon: '',
      featured: false,
      order: 0,
    },
  })

  useEffect(() => {
    const loadService = async () => {
      try {
        const serviceData = await fetchService(params.id)
        if (!serviceData) {
          toast({
            title: 'Error',
            description: 'Service not found.',
            variant: 'destructive',
          })
          router.push('/admin/services')
          return
        }

        setService(serviceData)
        form.reset({
          title: serviceData.title,
          slug: serviceData.slug,
          description: serviceData.description || '',
          content: serviceData.content || '',
          imageUrl: serviceData.imageUrl || '',
          icon: serviceData.icon || '',
          featured: serviceData.featured,
          order: serviceData.order,
        })
      } catch (error) {
        console.error('Error loading service:', error)
        toast({
          title: 'Error',
          description: 'Failed to load service.',
          variant: 'destructive',
        })
        router.push('/admin/services')
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
  }, [params.id, form, router])

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title)
    form.setValue('slug', slug)
  }

  const onSubmit = async (data: ServiceFormValues) => {
    if (!service) return

    setIsSubmitting(true)
    try {
      await updateService({ id: service.id, ...data })
      toast({
        title: 'Success',
        description: 'Service updated successfully.',
      })
      router.push('/admin/services')
    } catch (error) {
      console.error('Error updating service:', error)
      toast({
        title: 'Error',
        description: 'Failed to update service. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading service...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Link href="/admin/services">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/services">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">
            Update the service information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Update the information below to modify the service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter service title"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleTitleChange(e.target.value)
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="service-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title. Auto-generated from title.
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the service"
                        className="min-h-[100px]"
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
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed content about the service (supports Markdown)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the service. You can use Markdown formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Image</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || ''}
                          onChange={field.onChange}
                          folder="services"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image for the service (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Icon name or URL"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Icon identifier for the service (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Order in which the service appears (0 = first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
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
                          <FormLabel>Featured Service</FormLabel>
                          <FormDescription>
                            Mark this service as featured to highlight it
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/services')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Service
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}