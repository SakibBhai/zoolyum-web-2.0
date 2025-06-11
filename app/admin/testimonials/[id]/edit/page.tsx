'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/admin/image-uploader'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5).optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().optional(),
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      imageUrl: '',
      featured: false,
      order: 0,
    },
  })

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(`/api/testimonials/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch testimonial')
        }
        const testimonial = await response.json()
        
        form.reset({
          name: testimonial.name || '',
          position: testimonial.position || '',
          company: testimonial.company || '',
          content: testimonial.content || '',
          rating: testimonial.rating || 5,
          imageUrl: testimonial.imageUrl || '',
          featured: testimonial.featured || false,
          order: testimonial.order || 0,
        })
      } catch (error) {
        console.error('Error fetching testimonial:', error)
        toast({
          title: 'Error',
          description: 'Failed to load testimonial',
          variant: 'destructive',
        })
        router.push('/admin/testimonials')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchTestimonial()
  }, [params.id, form, toast, router])

  const onSubmit = async (data: TestimonialFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update testimonial')
      }

      toast({
        title: 'Success',
        description: 'Testimonial updated successfully',
      })

      router.push('/admin/testimonials')
    } catch (error) {
      console.error('Error updating testimonial:', error)
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-32" />
            <Skeleton className="h-40" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update testimonial information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>
            Update the information below to modify the testimonial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position/Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CEO, Marketing Director" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">⭐ 1 Star</SelectItem>
                          <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Content *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the testimonial content..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main testimonial text from the client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Photo</FormLabel>
                    <FormControl>
                      <ImageUploader
                        label="Upload client photo"
                        initialImageUrl={field.value}
                        onImageChange={field.onChange}
                        folder="testimonials"
                        helpText="Upload a photo of the client (optional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Testimonial</FormLabel>
                        <FormDescription>
                          Mark this testimonial as featured to highlight it
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Testimonial
                    </>
                  )}
                </Button>
                <Link href="/admin/testimonials">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}