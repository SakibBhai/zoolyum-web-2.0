"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadImage } from "@/lib/upload-operations"
import { useToast } from "@/hooks/use-toast"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  Heading1,
  Heading2,
  Heading3,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: string
  folder?: string
}

export function RichTextEditor({
  initialValue = "",
  onChange,
  placeholder = "Write your content here...",
  minHeight = "300px",
  folder = "blog",
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("url") // Default to URL tab
  const [bucketError, setBucketError] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Set initial content once on mount
  useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  // Check for storage bucket on component mount
  useEffect(() => {
    const checkBucket = async () => {
      try {
        // Create a small test file
        const testFile = new File(["test"], "test.txt", { type: "text/plain" })

        // Try to upload it
        const result = await uploadImage(testFile, "test")

        // If there's a bucket error, set the state
        if (result.bucketMissing) {
          setBucketError(true)
          setActiveTab("url")
        } else {
          // If upload succeeded, delete the test file
          setActiveTab("upload") // Only set to upload if bucket exists
        }
      } catch (err) {
        console.error("Error checking storage bucket:", err)
        setBucketError(true)
        setActiveTab("url")
      }
    }

    checkBucket()
  }, [])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange(newContent)
  }

  const insertAtCursor = (textToInsert: string) => {
    if (!editorRef.current) return

    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    const text = editorRef.current.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    const newContent = before + textToInsert + after
    setContent(newContent)
    onChange(newContent)

    // Set cursor position after the inserted text
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
        editorRef.current.selectionStart = start + textToInsert.length
        editorRef.current.selectionEnd = start + textToInsert.length
      }
    }, 0)
  }

  const getSelectedText = () => {
    if (!editorRef.current) return ""
    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    return editorRef.current.value.substring(start, end)
  }

  const formatText = (format: string) => {
    const selectedText = getSelectedText()
    let formattedText = ""

    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`
        break
      case "h1":
        formattedText = `\n# ${selectedText || "Heading 1"}\n`
        break
      case "h2":
        formattedText = `\n## ${selectedText || "Heading 2"}\n`
        break
      case "h3":
        formattedText = `\n### ${selectedText || "Heading 3"}\n`
        break
      case "ul":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `- ${line}`)
              .join("\n")
          : "- List item\n- Another item"
        break
      case "ol":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line, i) => `${i + 1}. ${line}`)
              .join("\n")
          : "1. List item\n2. Another item"
        break
      default:
        formattedText = selectedText
    }

    insertAtCursor(formattedText)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, WebP, or GIF)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const result = await uploadImage(file, folder)

      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        })

        if (result.bucketMissing) {
          setBucketError(true)
          setActiveTab("url")
        }
      } else if (result.url) {
        setImageUrl(result.url)
        toast({
          title: "Upload successful",
          description: "Image has been uploaded successfully",
        })
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
      setBucketError(true)
      setActiveTab("url")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const insertImage = () => {
    const url = activeTab === "upload" ? imageUrl : externalUrl
    if (!url) {
      toast({
        title: "No image selected",
        description: "Please upload an image or enter an image URL",
        variant: "destructive",
      })
      return
    }

    const alt = imageAlt || "Image"
    const markdown = `![${alt}](${url})`
    insertAtCursor(markdown)

    // Reset form
    setImageUrl("")
    setImageAlt("")
    setExternalUrl("")
    setImageDialogOpen(false)
  }

  const insertLink = () => {
    if (!linkUrl) {
      toast({
        title: "No URL entered",
        description: "Please enter a URL for the link",
        variant: "destructive",
      })
      return
    }

    const text = linkText || linkUrl
    const markdown = `[${text}](${linkUrl})`
    insertAtCursor(markdown)

    // Reset form
    setLinkUrl("")
    setLinkText("")
    setLinkDialogOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 bg-[#252525] border border-[#333333] rounded-t-lg">
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("bold")}>
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("italic")}>
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("h1")}>
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">Heading 1</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("h2")}>
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">Heading 2</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("h3")}>
          <Heading3 className="h-4 w-4" />
          <span className="sr-only">Heading 3</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("ul")}>
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("ol")}>
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
              <span className="sr-only">Insert Image</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>Upload an image or enter an image URL.</DialogDescription>
            </DialogHeader>

            {bucketError && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Storage Not Available</AlertTitle>
                <AlertDescription>Please use the Image URL tab to add images from external sources.</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" disabled={bucketError}>
                  Upload Image
                </TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Upload Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    disabled={bucketError}
                  />
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </div>

                {imageUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-md p-2">
                      <img src={imageUrl || "/placeholder.svg"} alt="Preview" className="max-h-40 mx-auto" />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="url" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="external-image-url">Image URL</Label>
                  <Input
                    id="external-image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the URL of an image hosted elsewhere (e.g., Imgur, ImgBB)
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                placeholder="Description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provide a description for screen readers</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertImage} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Insert Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Link className="h-4 w-4" />
              <span className="sr-only">Insert Link</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>Add a hyperlink to your content.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  placeholder="Click here"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
                <p className="text-xs text-gray-500">Leave empty to use the URL as link text</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertLink}>
                Insert Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <textarea
        ref={editorRef}
        value={content}
        onChange={handleContentChange}
        className="w-full px-4 py-3 bg-[#252525] border border-[#333333] rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#FF5001]/50 text-[#E9E7E2] font-mono"
        placeholder={placeholder}
        rows={10}
        style={{ minHeight }}
      />
    </div>
  )
}
