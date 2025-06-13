'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, Plus, Trash2, Upload } from 'lucide-react'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { ImageUploader } from '@/components/admin/image-uploader'

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: 'Site name is required' }),
  siteDescription: z.string().min(1, { message: 'Site description is required' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z.object({
    twitter: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
    facebook: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
    instagram: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  }),
})

type SiteSettingsValues = z.infer<typeof siteSettingsSchema>

const userSettingsSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type UserSettingsValues = z.infer<typeof userSettingsSchema>

const footerSettingsSchema = z.object({
  footerContent: z.string().optional(),
  copyright: z.string().optional(),
  disclaimer: z.string().optional(),
  aboutTagline: z.string().optional(),
  quickLinks: z.array(z.object({
    label: z.string().min(1, 'Label is required'),
    url: z.string().url('Please enter a valid URL'),
    openInNewTab: z.boolean().default(false)
  })).optional(),
  showSocialMedia: z.boolean().default(true),
  facebookUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  youtubeUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  whatsappUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  customSocialIcon: z.string().optional(),
  customSocialUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  showLogo: z.boolean().default(true),
  logoUrl: z.string().optional(),
  showLanguageSelector: z.boolean().default(false),
  supportedLanguages: z.array(z.string()).optional(),
  showNewsletter: z.boolean().default(false),
  newsletterPlaceholder: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  columnLayout: z.number().min(1).max(4).default(3),
  customCSS: z.string().optional(),
  showLegalLinks: z.boolean().default(true),
  privacyPolicyUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  termsConditionsUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  cookiePolicyUrl: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
})

type FooterSettingsValues = z.infer<typeof footerSettingsSchema>

export default function SettingsPage() {
  const [isSubmittingSite, setIsSubmittingSite] = useState(false)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [isSubmittingFooter, setIsSubmittingFooter] = useState(false)
  const [footerSettingsLoaded, setFooterSettingsLoaded] = useState(false)

  const siteForm = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: 'Zoolyum',
      siteDescription: 'Creative Agency',
      contactEmail: 'contact@zoolyum.com',
      contactPhone: '',
      address: '',
      socialLinks: {
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: '',
      },
    },
  })

  const userForm = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const footerForm = useForm<FooterSettingsValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
      footerContent: '',
      copyright: '© 2024 Zoolyum. All rights reserved.',
      disclaimer: '',
      aboutTagline: '',
      quickLinks: [],
      showSocialMedia: true,
      facebookUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',
      twitterUrl: '',
      whatsappUrl: '',
      customSocialIcon: '',
      customSocialUrl: '',
      showLogo: true,
      logoUrl: '',
      showLanguageSelector: false,
      supportedLanguages: [],
      showNewsletter: false,
      newsletterPlaceholder: 'Enter your email for updates',
      backgroundColor: '#1A1A1A',
      textColor: '#E9E7E2',
      columnLayout: 3,
      customCSS: '',
      showLegalLinks: true,
      privacyPolicyUrl: '',
      termsConditionsUrl: '',
      cookiePolicyUrl: ''
    },
  })

  const { fields: quickLinkFields, append: appendQuickLink, remove: removeQuickLink } = useFieldArray({
    control: footerForm.control,
    name: 'quickLinks'
  })

  async function onSubmitSiteSettings(data: SiteSettingsValues) {
    setIsSubmittingSite(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings updated',
        description: 'Your site settings have been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingSite(false)
    }
  }

  async function onSubmitUserSettings(data: UserSettingsValues) {
    setIsSubmittingUser(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
      
      // Reset password fields
      userForm.reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingUser(false)
    }
  }

  async function loadFooterSettings() {
    try {
      const response = await fetch('/api/footer-settings')
      if (response.ok) {
        const data = await response.json()
        footerForm.reset({
          ...data,
          quickLinks: data.quickLinks || [],
          supportedLanguages: data.supportedLanguages || []
        })
      }
    } catch (error) {
      console.error('Error loading footer settings:', error)
    } finally {
      setFooterSettingsLoaded(true)
    }
  }

  async function onSubmitFooterSettings(data: FooterSettingsValues) {
    setIsSubmittingFooter(true)
    try {
      const response = await fetch('/api/footer-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update footer settings')
      }
      
      toast({
        title: 'Footer settings updated',
        description: 'Your footer settings have been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating footer settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update footer settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingFooter(false)
    }
  }

  useEffect(() => {
    loadFooterSettings()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and site settings</p>
      </div>

      <Tabs defaultValue="site">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="footer">Footer Settings</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="site" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Update your site details and public information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...siteForm}>
                <form onSubmit={siteForm.handleSubmit(onSubmitSiteSettings)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={siteForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Zoolyum" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={siteForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={siteForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your site" 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={siteForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={siteForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={siteForm.control}
                        name="socialLinks.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/yourusername" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={siteForm.control}
                        name="socialLinks.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/yourpage" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={siteForm.control}
                        name="socialLinks.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/yourusername" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={siteForm.control}
                        name="socialLinks.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/yourusername" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingSite}>
                    {isSubmittingSite ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="footer" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>
                Customize your website footer content, links, and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...footerForm}>
                <form onSubmit={footerForm.handleSubmit(onSubmitFooterSettings)} className="space-y-8">
                  
                  {/* Footer Content Section */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Footer Content</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <FormField
                        control={footerForm.control}
                        name="footerContent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Footer Content</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                placeholder="Enter your footer content..."
                              />
                            </FormControl>
                            <FormDescription>
                              Rich text content for your footer. Supports formatting, links, and basic HTML.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={footerForm.control}
                          name="copyright"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Copyright Text</FormLabel>
                              <FormControl>
                                <Input placeholder="© 2024 Your Company. All rights reserved." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={footerForm.control}
                          name="aboutTagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Tagline</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief tagline about your company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={footerForm.control}
                        name="disclaimer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disclaimer</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Legal disclaimer or additional information" 
                                className="min-h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Quick Links Section */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Quick Links</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <div className="space-y-4">
                        {quickLinkFields.map((field, index) => (
                          <div key={field.id} className="flex gap-4 items-end p-4 border rounded-lg">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={footerForm.control}
                                name={`quickLinks.${index}.label`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Link Label</FormLabel>
                                    <FormControl>
                                      <Input placeholder="About Us" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={footerForm.control}
                                name={`quickLinks.${index}.url`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://example.com/about" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={footerForm.control}
                              name={`quickLinks.${index}.openInNewTab`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>New Tab</FormLabel>
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
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeQuickLink(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendQuickLink({ label: '', url: '', openInNewTab: false })}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quick Link
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Social Media Section */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Social Media</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <FormField
                        control={footerForm.control}
                        name="showSocialMedia"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Social Media Icons</FormLabel>
                              <FormDescription>
                                Display social media icons in the footer
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
                      
                      {footerForm.watch('showSocialMedia') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={footerForm.control}
                            name="facebookUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://facebook.com/yourpage" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="instagramUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://instagram.com/yourusername" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="youtubeUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>YouTube URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://youtube.com/c/yourchannel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="twitterUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://twitter.com/yourusername" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="whatsappUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>WhatsApp URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://wa.me/1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Footer Logo Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Footer Logo</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <FormField
                        control={footerForm.control}
                        name="showLogo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Logo in Footer</FormLabel>
                              <FormDescription>
                                Display your logo in the footer
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
                      
                      {footerForm.watch('showLogo') && (
                        <FormField
                          control={footerForm.control}
                          name="logoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Footer Logo</FormLabel>
                              <FormControl>
                                <ImageUploader
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  accept="image/*"
                                  maxSize={2 * 1024 * 1024} // 2MB
                                />
                              </FormControl>
                              <FormDescription>
                                Upload a logo for your footer. Recommended size: 200x60px
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Newsletter Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Newsletter Signup</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <FormField
                        control={footerForm.control}
                        name="showNewsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Newsletter Signup</FormLabel>
                              <FormDescription>
                                Display newsletter signup form in footer
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
                      
                      {footerForm.watch('showNewsletter') && (
                        <FormField
                          control={footerForm.control}
                          name="newsletterPlaceholder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Newsletter Placeholder Text</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email for updates" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Styling Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Styling Options</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={footerForm.control}
                          name="backgroundColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Background Color</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input 
                                    type="color" 
                                    className="w-16 h-10 p-1 border rounded"
                                    {...field} 
                                  />
                                  <Input 
                                    placeholder="#1A1A1A" 
                                    className="flex-1"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={footerForm.control}
                          name="textColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Text Color</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input 
                                    type="color" 
                                    className="w-16 h-10 p-1 border rounded"
                                    {...field} 
                                  />
                                  <Input 
                                    placeholder="#E9E7E2" 
                                    className="flex-1"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={footerForm.control}
                          name="columnLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Column Layout</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select columns" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 Column</SelectItem>
                                  <SelectItem value="2">2 Columns</SelectItem>
                                  <SelectItem value="3">3 Columns</SelectItem>
                                  <SelectItem value="4">4 Columns</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={footerForm.control}
                        name="customCSS"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom CSS</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="/* Custom CSS for footer */" 
                                className="min-h-32 font-mono text-sm"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Add custom CSS to further customize your footer appearance
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator />
                  
                  {/* Legal Links Section */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <h3 className="text-lg font-medium">Legal & Compliance</h3>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-6">
                      <FormField
                        control={footerForm.control}
                        name="showLegalLinks"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show Legal Links</FormLabel>
                              <FormDescription>
                                Display legal and compliance links in footer
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
                      
                      {footerForm.watch('showLegalLinks') && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={footerForm.control}
                            name="privacyPolicyUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Privacy Policy URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/privacy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="termsConditionsUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Terms & Conditions URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/terms" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={footerForm.control}
                            name="cookiePolicyUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cookie Policy URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/cookies" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="flex justify-end pt-6">
                    <Button type="submit" disabled={isSubmittingFooter || !footerSettingsLoaded}>
                      {isSubmittingFooter ? 'Saving...' : 'Save Footer Settings'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmitUserSettings)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={userForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    
                    <FormField
                      control={userForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={userForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave blank to keep current password
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingUser}>
                    {isSubmittingUser ? 'Saving...' : 'Update Profile'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}