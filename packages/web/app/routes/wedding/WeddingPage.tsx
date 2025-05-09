import { Link, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { HeartIcon, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "~/context/auth"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog"

// Mock gifts data - we'll implement this later
const mockGifts = [
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
]

interface Wedding {
  weddingId: string
  userId: string
  title: string
  date: string
  location: string
  story: string
  photoUrls: string[]
  visibility?: string
  customUrl?: string
  theme?: string
  primaryColor?: string
  createdAt?: string
  updatedAt?: string
}

export default function WeddingPage() {
  const { slug } = useParams()
  const auth = useAuth()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  useEffect(() => {
    const fetchWeddingInfo = async () => {
      try {
        // First try to get the wedding by custom URL
        let response = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/custom-url/${slug}`, {
          method: 'GET'
        });

        // If not found by custom URL, try getting it by ID
        if (response.status === 404) {
          response = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/${slug}`, {
            method: 'GET'
          });
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch wedding data');
        }

        const data = await response.json();
        setWedding(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchWeddingInfo();
    } else {
      setError('Wedding ID is required');
      setLoading(false);
    }
  }, [slug, auth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wedding details...</p>
        </div>
      </div>
    )
  }

  if (error || !wedding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Wedding not found'}</p>
          <Button asChild className="mt-4">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleImageClick = (photoUrl: string) => {
    setSelectedImage(photoUrl)
    const galleryPhotos = wedding.photoUrls.filter(url => url.includes('gallery-'))
    setCurrentImageIndex(galleryPhotos.indexOf(photoUrl))
  }

  const handlePreviousImage = () => {
    if (!wedding) return
    const galleryPhotos = wedding.photoUrls.filter(url => url.includes('gallery-'))
    const newIndex = (currentImageIndex - 1 + galleryPhotos.length) % galleryPhotos.length
    setCurrentImageIndex(newIndex)
    setSelectedImage(galleryPhotos[newIndex])
  }

  const handleNextImage = () => {
    if (!wedding) return
    const galleryPhotos = wedding.photoUrls.filter(url => url.includes('gallery-'))
    const newIndex = (currentImageIndex + 1) % galleryPhotos.length
    setCurrentImageIndex(newIndex)
    setSelectedImage(galleryPhotos[newIndex])
  }

  const formatWeddingDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const formattedDate = date.toISOString().split('T')[0]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return {
      date: formattedDate,
      time: `${hours}:${minutes}`
    }
  }

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
            src={`${import.meta.env.VITE_BUCKET_URL}/${wedding.photoUrls.find(url => url.includes('cover-'))}` || "/placeholder.svg?height=400&width=1200"}
            alt={wedding.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="container px-4 py-6 mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{wedding.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-white">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatWeddingDateTime(wedding.date).date} {formatWeddingDateTime(wedding.date).time}
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

        {wedding.photoUrls.length > 0 && (
          <section className="py-12">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wedding.photoUrls
                    .filter(url => url.includes('gallery-'))
                    .map((photoUrl, index) => (
                    <div 
                      key={index} 
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(photoUrl)}
                    >
                      <img
                        src={`${import.meta.env.VITE_BUCKET_URL}/${photoUrl}`}
                        alt={`Wedding photo ${index}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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
              {mockGifts.map((gift) => (
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
                      <Link to={`/${slug}/contribute/${gift.id}`}>Contribute</Link>
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
            <p>© 2025 WeddingWish. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-auto flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <DialogTitle className="sr-only">Wedding Photo Gallery</DialogTitle>
          <DialogDescription className="sr-only">
            View full size wedding photos. Use the arrow buttons to navigate between photos.
          </DialogDescription>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full"
                onClick={handlePreviousImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <img
                src={`${import.meta.env.VITE_BUCKET_URL}/${selectedImage}`}
                alt="Full size wedding photo"
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
