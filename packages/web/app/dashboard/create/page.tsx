"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { HeartIcon, ArrowLeft, ImagePlus, Plus, Trash2 } from "lucide-react"
import { DatePicker } from "../../components/date-picker"
import { ImageUploader } from "../../components/image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth } from "~/context/auth"
import { v4 as uuidv4 } from 'uuid'

export default function CreateWeddingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const weddingId = searchParams.get('weddingId');
  const isEditMode = !!weddingId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [weddingDetails, setWeddingDetails] = useState({
    title: "",
    date: new Date(),
    location: "",
    story: "",
    coverPhoto: null as File | null,
    coverPhotoPreview: "",
    additionalPhotos: [] as { file: File; preview: string }[],
    giftItems: [] as {
      id: string;
      name: string;
      description: string;
      price: string;
      imageFile: File | null;
      imagePreview: string;
    }[],
  });

  const [newGiftItem, setNewGiftItem] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    imageFile: null as File | null,
    imagePreview: "",
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

  const handleGiftImageSelected = (file: File) => {
    const preview = URL.createObjectURL(file)
    setNewGiftItem((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
    }))
  }

  const handleNewGiftItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewGiftItem((prev) => ({ ...prev, [name]: value }))
  }

  const addGiftItem = () => {
    if (newGiftItem.name && newGiftItem.price) {
      const id = Date.now().toString()
      setWeddingDetails((prev) => ({
        ...prev,
        giftItems: [...prev.giftItems, { ...newGiftItem, id }],
      }))
      setNewGiftItem({
        id: "",
        name: "",
        description: "",
        price: "",
        imageFile: null,
        imagePreview: "",
      })
    }
  }

  const removeGiftItem = (id: string) => {
    setWeddingDetails((prev) => ({
      ...prev,
      giftItems: prev.giftItems.filter((item) => item.id !== id),
    }))
  }

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      if (!isEditMode || !weddingId) return;

      try {
        // Fetch wedding details
        const weddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/id/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!weddingResponse.ok) {
          throw new Error('Failed to fetch wedding details');
        }

        const weddingData = await weddingResponse.json();
        
        // Fetch photos
        const photosResponse = await fetch(`${import.meta.env.VITE_API_URL}api/photo/wedding/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!photosResponse.ok) {
          throw new Error('Failed to fetch photos');
        }

        const photosData = await photosResponse.json();
        
        // Update form with existing data
        setWeddingDetails(prev => ({
          ...prev,
          title: weddingData.title || "",
          date: weddingData.date ? new Date(weddingData.date.split('T')[0]) : new Date(),
          location: weddingData.location || "",
          story: weddingData.story || "",
          coverPhotoPreview: photosData.find((photo: { key: string }) => photo.key.includes('cover-'))?.url || "",
          additionalPhotos: photosData
            .filter((photo: { key: string }) => photo.key.includes('gallery-'))
            .map((photo: { key: string; url: string }) => ({
              file: null as File | null,
              preview: photo.url,
            })),
        }));
      } catch (error) {
        console.error('Error fetching wedding details:', error);
        alert('Failed to load wedding details. Please try again.');
      }
    };

    fetchWeddingDetails();
  }, [isEditMode, weddingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const weddingId = searchParams.get('weddingId') || uuidv4();
      const photoUrls: string[] = [];

      if (isEditMode) {
        // 1. Get current wedding data and photos
        const currentWeddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/id/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!currentWeddingResponse.ok) {
          throw new Error('Failed to fetch current wedding data');
        }

        const currentWedding = await currentWeddingResponse.json();
        const currentPhotoUrls: string[] = (currentWedding.photoUrls || []).map((url: string) => 
          url.startsWith('weddings/') ? url : `weddings/${weddingId}/${url}`
        );

        // 2. Process new photos (both cover and gallery)
        const newPhotoUrls = await processNewPhotos(weddingId);
        photoUrls.push(...newPhotoUrls);

        // 3. Get existing photos that should be kept
        const existingPhotoUrls = weddingDetails.additionalPhotos
          .filter(photo => !photo.file)
          .map(photo => {
            const urlParts = photo.preview.split('/');
            const keyWithParams = urlParts[urlParts.length - 1];
            const fileName = keyWithParams.split('?')[0];
            return `weddings/${weddingId}/${fileName}`;
          });

        // 4. Find and delete removed photos
        const photosToDelete = currentPhotoUrls.filter(url => 
          ![...newPhotoUrls, ...existingPhotoUrls].includes(url)
        );

        await deletePhotos(photosToDelete);

        // 5. Update wedding with all photos (new + existing)
        await updateWedding(weddingId, [...newPhotoUrls, ...existingPhotoUrls]);
      } else {
        // Create mode - simply process all new photos and create wedding
        const newPhotoUrls = await processNewPhotos(weddingId);
        await updateWedding(weddingId, newPhotoUrls);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} wedding:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} wedding. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to process new photos (both cover and gallery)
  const processNewPhotos = async (weddingId: string): Promise<string[]> => {
    const photoUrls: string[] = [];

    // Process cover photo
    if (weddingDetails.coverPhoto) {
      const coverPhotoUrl = await uploadPhoto(
        weddingId,
        weddingDetails.coverPhoto,
        `cover-${weddingDetails.coverPhoto.name}`
      );
      photoUrls.push(coverPhotoUrl);
    }

    // Process gallery photos
    for (const photo of weddingDetails.additionalPhotos) {
      if (!photo.file) continue;

      const galleryPhotoUrl = await uploadPhoto(
        weddingId,
        photo.file,
        `gallery-${photo.file.name}`
      );
      photoUrls.push(galleryPhotoUrl);
    }

    return photoUrls;
  };

  // Helper function to upload a single photo
  const uploadPhoto = async (weddingId: string, file: File, fileName: string): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}api/photo/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await auth.getToken()}`,
      },
      body: JSON.stringify({
        weddingId,
        fileName,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get photo upload URL');
    }

    const { signedUrl, key } = await response.json();
    
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return key;
  };

  // Helper function to delete photos
  const deletePhotos = async (photoKeys: string[]): Promise<void> => {
    for (const key of photoKeys) {
      await fetch(`${import.meta.env.VITE_API_URL}api/photo/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({ key }),
      });
    }
  };

  // Helper function to update/create wedding in DynamoDB
  const updateWedding = async (weddingId: string, photoUrls: string[]): Promise<void> => {
    const body = {
      weddingId,
      userId: auth.user?.email,
      title: weddingDetails.title,
      date: weddingDetails.date.toISOString(),
      location: weddingDetails.location,
      story: weddingDetails.story,
      photoUrls,
      updatedAt: new Date().toISOString().split("T")[0],
      ...(isEditMode ? {} : { createdAt: new Date().toISOString().split("T")[0] }),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}api/wedding/${isEditMode ? 'update' : 'create'}`,
      {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} wedding`);
    }
  };

  const goToNextTab = () => {
    if (activeTab === "details") {
      setActiveTab("photos")
    } else if (activeTab === "photos") {
      setActiveTab("gifts")
    } else if (activeTab === "gifts") {
      setActiveTab("preview")
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "photos") {
      setActiveTab("details")
    } else if (activeTab === "gifts") {
      setActiveTab("photos")
    } else if (activeTab === "preview") {
      setActiveTab("gifts")
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
          <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Your Wedding Page' : 'Create Your Wedding Page'}</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Wedding Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="gifts">Gift Registry</TabsTrigger>
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
                    Next: Add Gifts
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="gifts">
              <Card>
                <CardHeader>
                  <CardTitle>Gift Registry</CardTitle>
                  <CardDescription>Add items to your gift registry that guests can contribute to.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Gift Item</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                          <div>
                            {newGiftItem.imagePreview ? (
                              <div className="relative aspect-square overflow-hidden rounded-lg border">
                                <img
                                  src={newGiftItem.imagePreview}
                                  alt="Gift preview"
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => setNewGiftItem((prev) => ({ ...prev, imageFile: null, imagePreview: "" }))}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <ImageUploader onImageSelected={handleGiftImageSelected} />
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="gift-name">Gift Name</Label>
                              <Input
                                id="gift-name"
                                name="name"
                                value={newGiftItem.name}
                                onChange={handleNewGiftItemChange}
                                placeholder="e.g., Wedding Dress, Honeymoon Fund"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gift-price">Price ($)</Label>
                              <Input
                                id="gift-price"
                                name="price"
                                type="number"
                                value={newGiftItem.price}
                                onChange={handleNewGiftItemChange}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gift-description">Description</Label>
                              <Textarea
                                id="gift-description"
                                name="description"
                                value={newGiftItem.description}
                                onChange={handleNewGiftItemChange}
                                placeholder="Describe this gift and why it's important to you..."
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={addGiftItem} className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Gift Item
                        </Button>
                      </CardFooter>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Your Gift Registry</h3>
                      {weddingDetails.giftItems.length === 0 ? (
                        <Card className="text-center p-6">
                          <p className="text-gray-500">Your gift registry is empty. Add some items above.</p>
                        </Card>
                      ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {weddingDetails.giftItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="aspect-video bg-gray-100 relative">
                                {item.imagePreview ? (
                                  <img
                                    src={item.imagePreview}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                    <p className="font-medium mt-2">${item.price}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => removeGiftItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
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
                        {weddingDetails.giftItems.length > 0 ? (
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {weddingDetails.giftItems.map((item) => (
                              <Card key={item.id}>
                                <div className="aspect-video bg-gray-100">
                                  {item.imagePreview ? (
                                    <img
                                      src={item.imagePreview}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      No image
                                    </div>
                                  )}
                                </div>
                                <CardHeader>
                                  <CardTitle>{item.name}</CardTitle>
                                  <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="font-medium">${item.price}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No gift items added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousTab}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Wedding Page" : "Create Wedding Page")}
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
