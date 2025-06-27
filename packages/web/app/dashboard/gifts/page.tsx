"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { HeartIcon, ArrowLeft, Plus, Trash2, ImagePlus } from "lucide-react"
import { ImageUploader } from "~/components/image-uploader"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { useAuth } from "~/context/auth"

interface GiftItem {
  id: string
  name: string
  description: string
  price: string
  imageFile: File | null
  imagePreview: string
  imageUrl?: string
}

export default function ManageGifts() {
  const auth = useAuth()
  const [giftItems, setGiftItems] = useState<GiftItem[]>([
    {
      id: "1",
      name: "Wedding Dress",
      description: "Help us fund the perfect wedding dress",
      price: "1500",
      imageFile: null,
      imagePreview: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Wedding Rings",
      description: "Contribute to our wedding rings",
      price: "1000",
      imageFile: null,
      imagePreview: "/placeholder.svg",
    },
  ])

  const [newItem, setNewItem] = useState<GiftItem>({
    id: "",
    name: "",
    description: "",
    price: "",
    imageFile: null,
    imagePreview: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [weddingId, setWeddingId] = useState<string>("")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Load wedding ID when component mounts
  useEffect(() => {
    const loadWeddingId = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/current`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wedding ID');
        }

        const data = await response.json();
        setWeddingId(data.id);
      } catch (error) {
        console.error('Error loading wedding ID:', error);
        setSaveError('Failed to load wedding ID. Please try again.');
        setTimeout(() => {
          setSaveError(null);
        }, 5000);
      }
    };

    loadWeddingId();
  }, [auth]);

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelected = (file: File) => {
    const preview = URL.createObjectURL(file)
    setNewItem((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
    }))
  }

  const handleGiftImageSelected = async (file: File, id: string) => {
    try {
      // Get the upload URL from the API
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/photo-upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          giftId: id,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { signedUrl, key } = await response.json();
      
      // Upload the file to S3
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Construct the CloudFront URL
      const cloudFrontUrl = `${import.meta.env.VITE_BUCKET_URL}/${key}`;
      
      // Update the gift item with both the file and the CloudFront URL
      setGiftItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
                imageUrl: cloudFrontUrl,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show an error message to the user here
    }
  }

  const addNewItem = () => {
    if (newItem.name && newItem.price) {
      const id = Date.now().toString()
      setGiftItems((prev) => [...prev, { ...newItem, id }])
      setNewItem({
        id: "",
        name: "",
        description: "",
        price: "",
        imageFile: null,
        imagePreview: "",
      })
    }
  }

  const removeItem = (id: string) => {
    setGiftItems((prev) => prev.filter((item) => item.id !== id))
  }

  const startEditing = (item: GiftItem) => {
    setNewItem(item)
    setIsEditing(true)
    setEditingId(item.id)
  }

  const cancelEditing = () => {
    setNewItem({
      id: "",
      name: "",
      description: "",
      price: "",
      imageFile: null,
      imagePreview: "",
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const saveEditing = () => {
    setGiftItems((prev) => prev.map((item) => (item.id === editingId ? newItem : item)))
    cancelEditing()
  }

  const saveGiftRegistry = async () => {
    try {
      // Prepare the gift items for saving
      const giftsToSave = giftItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        imageUrl: item.imageUrl, // This will now be the full CloudFront URL
      }));

      // Save to your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({ gifts: giftsToSave }),
      });

      if (!response.ok) {
        throw new Error('Failed to save gift registry');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving gift registry:', error);
      // You might want to show an error message to the user here
    }
  }

  const deleteGift = async (giftId: string) => {
    try {
      setIsDeleting(giftId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/${giftId}/${weddingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await auth.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete gift');
      }

      // Remove the gift from the local state
      setGiftItems(prev => prev.filter(item => item.id !== giftId));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting gift:', error);
      setSaveError('Failed to delete gift. Please try again.');
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Manage Gift Registry</h1>
            <Button onClick={saveGiftRegistry} className="bg-pink-500 hover:bg-pink-600">
              Save Registry
            </Button>
          </div>

          {saveSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Gift registry saved successfully!</AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Gift Item" : "Add New Gift Item"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update the details of this gift item"
                  : "Add items to your registry that guests can contribute to"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                <div>
                  {newItem.imagePreview ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={newItem.imagePreview || "/placeholder.svg"}
                        alt="Gift preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setNewItem((prev) => ({ ...prev, imageFile: null, imagePreview: "" }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <ImageUploader onImageSelected={handleImageSelected} />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Gift Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleNewItemChange}
                      placeholder="e.g., Wedding Dress, Honeymoon Fund"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (sek)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newItem.price}
                      onChange={handleNewItemChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleNewItemChange}
                      placeholder="Describe this gift and why it's important to you..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button onClick={saveEditing}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={addNewItem} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gift Item
                </Button>
              )}
            </CardFooter>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Your Gift Registry</h2>
          {giftItems.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-gray-500">Your gift registry is empty. Add some items above.</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {giftItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {item.imagePreview ? (
                      <img
                        src={item.imagePreview || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Button
                          variant="ghost"
                          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                          onClick={() => {
                            const fileInput = document.createElement("input")
                            fileInput.type = "file"
                            fileInput.accept = "image/*"
                            fileInput.onchange = (e) => {
                              const target = e.target as HTMLInputElement
                              if (target.files && target.files[0]) {
                                handleGiftImageSelected(target.files[0], item.id)
                              }
                            }
                            fileInput.click()
                          }}
                        >
                          <ImagePlus className="h-8 w-8 mb-2 text-gray-400" />
                          <span className="text-sm">Add Image</span>
                        </Button>
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
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(item)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteGift(item.id)}
                          disabled={isDeleting === item.id}
                        >
                          {isDeleting === item.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
