"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { HeartIcon, ArrowLeft, Plus, Trash2, ImagePlus } from "lucide-react"
import { ImageUploader } from "~/components/image-uploader"
import { Alert, AlertDescription } from "~/components/ui/alert"

interface GiftItem {
  id: string
  name: string
  description: string
  price: string
  imageFile: File | null
  imagePreview: string
}

export default function ManageGifts() {
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

  const handleGiftImageSelected = (file: File, id: string) => {
    const preview = URL.createObjectURL(file)
    setGiftItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              imageFile: file,
              imagePreview: preview,
            }
          : item,
      ),
    )
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

  const saveGiftRegistry = () => {
    // In a real app, you would save the gift registry to a database
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

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
                    <Label htmlFor="price">Price ($)</Label>
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
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
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
