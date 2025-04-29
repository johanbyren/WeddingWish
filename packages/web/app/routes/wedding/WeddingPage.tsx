import { Link, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { HeartIcon, Calendar, MapPin } from "lucide-react"

// This would normally come from a database
const mockWeddingData = {
  id: "123",
  title: "John & Jane's Wedding",
  date: "June 15, 2024",
  location: "Sunset Beach Resort, Miami, FL",
  story:
    "We met 5 years ago at a coffee shop and have been inseparable ever since. We're excited to celebrate our special day with you!",
  coverPhotoUrl: "/placeholder.svg",
  gifts: [
    {
      id: "1",
      name: "Wedding Dress",
      description: "Help us fund the perfect wedding dress",
      price: 1500,
      collected: 750,
      imageUrl: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Wedding Rings",
      description: "Contribute to our wedding rings",
      price: 1000,
      collected: 400,
      imageUrl: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Honeymoon Trip",
      description: "Help us have an unforgettable honeymoon in Bali",
      price: 3000,
      collected: 1200,
      imageUrl: "/placeholder.svg",
    },
  ],
}

export default function WeddingPage() {
  const { id } = useParams()
  // In a real app, you would fetch the wedding data based on the ID
  const wedding = mockWeddingData

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col">
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={wedding.coverPhotoUrl || "/placeholder.svg?height=400&width=1200"}
            alt={wedding.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="container px-4 py-6 mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{wedding.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-white">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {wedding.date}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {wedding.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">{wedding.story}</p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-pink-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold">Gift Registry</h2>
              <p className="text-gray-700 mt-2">
                Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift,
                we have created this registry.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {wedding.gifts.map((gift) => (
                <Card key={gift.id}>
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={gift.imageUrl || "/placeholder.svg?height=200&width=400"}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{gift.name}</CardTitle>
                    <CardDescription>{gift.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          ${gift.collected} of ${gift.price}
                        </span>
                        <span className="text-sm font-medium">{Math.round((gift.collected / gift.price) * 100)}%</span>
                      </div>
                      <Progress value={(gift.collected / gift.price) * 100} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                      <Link to={`/wedding/${wedding.id}/contribute/${gift.id}`}>Contribute</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
