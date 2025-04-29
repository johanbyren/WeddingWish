"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { HeartIcon, ArrowLeft, ImagePlus } from "lucide-react"
import { DatePicker } from "../../components/date-picker"
import { ImageUploader } from "../../components/image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function CreateWeddingPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [weddingDetails, setWeddingDetails] = useState({
    title: "",
    date: new Date(),
    location: "",
    story: "",
    coverPhoto: null as File | null,
    coverPhotoPreview: "",
    additionalPhotos: [] as { file: File; preview: string }[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWeddingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setWeddingDetails((prev) => ({ ...prev, date }))
    }
  }

  const handleCoverPhotoChange = (file: File) => {
    const preview = URL.createObjectURL(file)
    setWeddingDetails((prev) => ({
      ...prev,
      coverPhoto: file,
      coverPhotoPreview: preview,
    }))
  }

  const handleAdditionalPhotoAdd = (file: File) => {
    const preview = URL.createObjectURL(file)
    setWeddingDetails((prev) => ({
      ...prev,
      additionalPhotos: [...prev.additionalPhotos, { file, preview }],
    }))
  }

  const removeAdditionalPhoto = (index: number) => {
    setWeddingDetails((prev) => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, you would upload the images and save the wedding details to a database
    // For this demo, we'll simulate a successful creation and redirect to the dashboard
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/dashboard")
    }, 1500)
  }

  const goToNextTab = () => {
    if (activeTab === "details") {
      setActiveTab("photos")
    } else if (activeTab === "photos") {
      setActiveTab("preview")
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "photos") {
      setActiveTab("details")
    } else if (activeTab === "preview") {
      setActiveTab("photos")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create Your Wedding Page</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Wedding Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Details</CardTitle>
                  <CardDescription>
                    Fill in the basic information about your wedding to create your page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Wedding Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="John & Jane's Wedding"
                        value={weddingDetails.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Wedding Date</Label>
                      <DatePicker date={weddingDetails.date} setDate={handleDateChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Wedding Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Venue name and address"
                        value={weddingDetails.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="story">Your Love Story</Label>
                      <Textarea
                        id="story"
                        name="story"
                        placeholder="Share your journey together..."
                        className="min-h-[150px]"
                        value={weddingDetails.story}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link to="/dashboard">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600">
                    Next: Add Photos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Photos</CardTitle>
                  <CardDescription>Upload photos for your wedding page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Cover Photo</Label>
                      <p className="text-sm text-gray-500">
                        This will be the main image at the top of your wedding page.
                      </p>
                      {weddingDetails.coverPhotoPreview ? (
                        <div className="relative aspect-[3/1] overflow-hidden rounded-lg border">
                          <img
                            src={weddingDetails.coverPhotoPreview || "/placeholder.svg"}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              setWeddingDetails((prev) => ({ ...prev, coverPhoto: null, coverPhotoPreview: "" }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <ImageUploader onImageSelected={handleCoverPhotoChange} />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Photos</Label>
                      <p className="text-sm text-gray-500">Add more photos to your wedding gallery (optional).</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {weddingDetails.additionalPhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                            <img
                              src={photo.preview || "/placeholder.svg"}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeAdditionalPhoto(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="aspect-square flex items-center justify-center border rounded-lg border-dashed">
                          <ImageUploader 
                            onImageSelected={handleAdditionalPhotoAdd}
                            className="w-full h-full flex items-center justify-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousTab}>
                    Back
                  </Button>
                  <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600">
                    Next: Preview
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Your Wedding Page</CardTitle>
                  <CardDescription>This is how your wedding page will look to your guests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    {/* Preview Header */}
                    <div className="relative h-[200px] bg-gray-100">
                      {weddingDetails.coverPhotoPreview ? (
                        <img
                          src={weddingDetails.coverPhotoPreview || "/placeholder.svg"}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No cover photo selected
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-end">
                        <div className="p-4 text-white">
                          <h2 className="text-2xl font-bold">{weddingDetails.title || "Your Wedding Title"}</h2>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <div className="flex items-center">
                              <span>
                                {weddingDetails.date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span>{weddingDetails.location || "Wedding Location"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="p-6 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Our Story</h3>
                        <p className="text-gray-700">{weddingDetails.story || "Your love story will appear here..."}</p>
                      </div>

                      {weddingDetails.additionalPhotos.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Photo Gallery</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {weddingDetails.additionalPhotos.map((photo, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={photo.preview || "/placeholder.svg"}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-semibold mb-2">Gift Registry</h3>
                        <p className="text-gray-500 italic">
                          You can add gift items to your registry after creating your wedding page.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousTab}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Wedding Page"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
