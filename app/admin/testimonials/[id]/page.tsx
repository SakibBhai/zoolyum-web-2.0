'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Edit, Trash2, Star, Building, User, Calendar, Hash } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Testimonial {
  id: string
  name: string
  position?: string
  company?: string
  content: string
  rating?: number
  imageUrl?: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function ViewTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(`/api/testimonials/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch testimonial')
        }
        const data = await response.json()
        setTestimonial(data)
      } catch (error) {
        console.error('Error fetching testimonial:', error)
        toast({
          title: 'Error',
          description: 'Failed to load testimonial',
          variant: 'destructive',
        })
        router.push('/admin/testimonials')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonial()
  }, [params.id, toast, router])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete testimonial')
      }

      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      })

      router.push('/admin/testimonials')
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Testimonial not found</h2>
          <p className="text-muted-foreground mb-4">The testimonial you're looking for doesn't exist.</p>
          <Link href="/admin/testimonials">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Testimonials
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/testimonials">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Testimonial Details</h1>
            <p className="text-muted-foreground">View and manage testimonial information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/testimonials/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the testimonial
                  from {testimonial.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} />
                    <AvatarFallback className="text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{testimonial.name}</CardTitle>
                    {(testimonial.position || testimonial.company) && (
                      <CardDescription className="text-base">
                        {testimonial.position}
                        {testimonial.position && testimonial.company && ' at '}
                        {testimonial.company}
                      </CardDescription>
                    )}
                    {testimonial.rating && (
                      <div className="mt-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {testimonial.featured && (
                    <Badge variant="secondary">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Testimonial Content</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-lg leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Client Name</p>
                  <p className="text-sm text-muted-foreground">{testimonial.name}</p>
                </div>
              </div>

              {testimonial.position && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Position</p>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  </div>
                </div>
              )}

              {testimonial.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Display Order</p>
                  <p className="text-sm text-muted-foreground">{testimonial.order}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(testimonial.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Featured</span>
                  <Badge variant={testimonial.featured ? 'default' : 'secondary'}>
                    {testimonial.featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {testimonial.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rating</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}