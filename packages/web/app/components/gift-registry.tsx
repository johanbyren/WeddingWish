"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface GiftItem {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
}

export function GiftRegistry() {
  const [giftItems, setGiftItems] = useState<GiftItem[]>([
    {
      id: "1",
      name: "Wedding Dress",
      description: "Help us fund the perfect wedding dress",
      price: "1500",
      imageUrl: "",
    },
    {
      id: "2",
      name: "Wedding Rings",
      description: "Contribute to our wedding rings",
      price: "1000",
      imageUrl: "",
    },
  ])

  const [newItem, setNewItem] = useState<GiftItem>({
    id: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  })

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
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
        imageUrl: "",
      })
    }
  }

  const removeItem = (id: string) => {
    setGiftItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {giftItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="font-medium mt-2">${item.price}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Add New Gift Item</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Gift Name</Label>
              <Input id="name" name="name" value={newItem.name} onChange={handleNewItemChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" value={newItem.price} onChange={handleNewItemChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={newItem.imageUrl} onChange={handleNewItemChange} />
          </div>
          <Button onClick={addNewItem} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Gift Item
          </Button>
        </div>
      </div>
    </div>
  )
}
