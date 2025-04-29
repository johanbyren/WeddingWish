import type React from "react"

import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { HeartIcon } from "lucide-react"

// Mock data - in a real app this would come from a database
const mockGift = {
  id: "1",
  name: "Wedding Dress",
  description: "Help us fund the perfect wedding dress",
  price: 1500,
  collected: 750,
  imageUrl: "/placeholder.svg",
  weddingId: "123",
  weddingTitle: "John & Jane's Wedding",
}

export default function ContributePage() {
  const { id, giftId } = useParams()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("50")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // In a real app, you would fetch the gift data based on the ID
  const gift = mockGift

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would process the payment and update the database
      setIsProcessing(false)
      navigate(`/wedding/${id}/thank-you`)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col bg-gradient-to-b from-white to-pink-50">
        <div className="container px-4 md:px-6 py-12 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to={`/wedding/${id}`} className="text-pink-500 hover:underline">
                &larr; Back to {gift.weddingTitle}
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <div className="aspect-video bg-gray-100">
                  <img
                    src={gift.imageUrl || "/placeholder.svg?height=300&width=500"}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{gift.name}</CardTitle>
                  <CardDescription>{gift.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>Total price: ${gift.price}</span>
                    <span>Already collected: ${gift.collected}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Make a Contribution</CardTitle>
                  <CardDescription>
                    Your contribution will help make their special day even more memorable.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Contribution Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      <h3 className="font-medium">Payment Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Contribute $${amount}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 WeddingWish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
