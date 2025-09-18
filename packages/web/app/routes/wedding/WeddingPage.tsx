import { Link, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { HeartIcon, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "~/context/auth"
import { useTranslation } from "~/context/translation"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog"
import { FullScreenLoading } from "~/components/loading-spinner"

interface Gift {
  giftId: string;
  name: string;
  description: string;
  price: number;
  totalContributed: number;
  imageUrl: string | null;
  isFullyFunded: boolean;
}

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
  language?: "en" | "sv"
  createdAt?: string
  updatedAt?: string
  paymentSettings?: any
  languageSettings?: {
    language: "en" | "sv"
  }
}

export default function WeddingPage() {
  const { slug } = useParams()
  const auth = useAuth()
  const { t, setLanguage } = useTranslation()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [giftImages, setGiftImages] = useState<Record<string, string>>({})

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
        
        // Set language from wedding settings if available
        if (data.language) {
          setLanguage(data.language);
        } else if (data.languageSettings?.language) {
          setLanguage(data.languageSettings.language);
        }

        // Fetch gifts for this wedding
        const giftsResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/wedding/${data.weddingId}`, {
          method: 'GET'
        });

        if (!giftsResponse.ok) {
          throw new Error('Failed to fetch gifts');
        }

        const giftsData = await giftsResponse.json();
        setGifts(giftsData);
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

  useEffect(() => {
    const loadGiftImages = async () => {
      if (!gifts) return;

      const imageUrls: Record<string, string> = {};
      for (const gift of gifts) {
        try {
          if (gift.imageUrl) {
            console.log('Using image URL for gift:', gift.giftId, 'URL:', gift.imageUrl);
            imageUrls[gift.giftId] = gift.imageUrl;
          } else {
            console.log('No image URL for gift:', gift.giftId);
            imageUrls[gift.giftId] = "/placeholder.svg?height=200&width=400";
          }
        } catch (error) {
          console.error(`Error processing image for gift ${gift.giftId}:`, error);
          imageUrls[gift.giftId] = "/placeholder.svg?height=200&width=400";
        }
      }
      console.log('Loaded gift images:', imageUrls);
      setGiftImages(imageUrls);
    };

    loadGiftImages();
  }, [gifts]);

  if (loading) {
    return (
      <FullScreenLoading text={t('loading.weddingDetails')} />
    )
  }

  if (error || !wedding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{t('weddingPage.error')}</h2>
          <p className="mt-2 text-gray-600">{error || t('weddingPage.weddingNotFound')}</p>
          <Link to="/" className="block">
            <Button className="w-full mt-4">
              {t('weddingPage.backToHome')}
            </Button>
          </Link>
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
        <span>Our Dream Day</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col">
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={wedding.photoUrls.find(url => url.includes('cover-')) || "/placeholder.svg?height=400&width=1200"}
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
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                    title={`View ${wedding.location} on Google Maps`}
                  >
                    {wedding.location}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{t('weddingPage.story')}</h2>
              <p className="text-gray-700 leading-relaxed">{wedding.story}</p>
            </div>
          </div>
        </section>

        {wedding.photoUrls.length > 0 && (
          <section className="py-12">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">{t('weddingPage.photoGallery')}</h2>
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
                        src={photoUrl}
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
              <h2 className="text-2xl font-bold">{t('weddingPage.giftRegistry')}</h2>
              <p className="text-gray-700 mt-2">
                {t('weddingPage.giftRegistryDescription')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {gifts.map((gift) => (
                <Card key={gift.giftId}>
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={giftImages[gift.giftId] || "/placeholder.svg?height=200&width=400"}
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
                          {gift.totalContributed} {t('weddingPage.sekOf')} {gift.price} {t('weddingPage.sek')}
                        </span>
                        <span className="text-sm font-medium">{Math.round((gift.totalContributed / gift.price) * 100)}%</span>
                      </div>
                      <Progress value={(gift.totalContributed / gift.price) * 100} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/${slug}/contribute/${gift.giftId}`} className="block w-full">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600">
                        {t('weddingPage.contribute')}
                      </Button>
                    </Link>
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
            <p>© 2025 Our Dream Day. All rights reserved.</p>
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
            <div className="relative w-full h-full flex items-center justify-center px-24">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full shadow-xl z-20 border border-gray-200"
                onClick={handlePreviousImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage}
                alt="Full size wedding photo"
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full shadow-xl z-20 border border-gray-200"
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
