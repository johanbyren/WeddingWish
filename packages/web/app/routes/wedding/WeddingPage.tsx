import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, Suspense } from "react"
import { useAuth } from "~/context/auth"
import { useTranslation } from "~/context/translation"
import { FullScreenLoading } from "~/components/loading-spinner"
import { getThemeConfig, getThemeStyles } from "~/utils/themes"
import { getThemeComponent } from "./themes"
import { Button } from "~/components/ui/button"

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
  time?: string
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
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const { t, setLanguage } = useTranslation()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [themeData, setThemeData] = useState<{theme: string, primaryColor: string} | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // Get theme data from location state (passed from Thank You page)
  const passedTheme = location.state?.theme
  const passedPrimaryColor = location.state?.primaryColor
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
        
        // Set theme data immediately for loading spinner
        setThemeData({
          theme: data.theme || 'classic',
          primaryColor: data.primaryColor || 'pink'
        });
        
        // Set language from wedding settings if available
        if (data.language) {
          setLanguage(data.language);
        } else if (data.languageSettings?.language) {
          setLanguage(data.languageSettings.language);
        }

        // Set loading to false after wedding data is loaded (before gifts)
        setLoading(false);

        // Fetch gifts for this wedding (this can happen in background)
        try {
          const giftsResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/wedding/${data.weddingId}`, {
            method: 'GET'
          });

          if (!giftsResponse.ok) {
            throw new Error('Failed to fetch gifts');
          }

          const giftsData = await giftsResponse.json();
          setGifts(giftsData);
        } catch (giftError) {
          console.error('Error fetching gifts:', giftError);
          // Don't throw here, we can still show the page without gifts
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
      <FullScreenLoading 
        text={t('loading.weddingDetails')} 
        theme={passedTheme || themeData?.theme}
        primaryColor={passedPrimaryColor || themeData?.primaryColor}
      />
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

  const formatWeddingDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString()
    
    // Use separate time field if available, otherwise extract from date
    let formattedTime = ''
    if (timeString) {
      formattedTime = timeString
    } else {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      formattedTime = `${hours}:${minutes}`
    }
    
    return {
      date: formattedDate,
      time: formattedTime
    }
  }

  const theme = wedding.theme || 'classic';
  const color = wedding.primaryColor || 'pink';
  const themeConfig = getThemeConfig(theme, color);
  const themeStyles = getThemeStyles(theme, color);

  // Get the appropriate theme component
  const ThemeComponent = getThemeComponent(theme);

  return (
    <Suspense fallback={<FullScreenLoading theme={theme} primaryColor={color} />}>
      <ThemeComponent 
        wedding={wedding} 
        gifts={gifts} 
        themeConfig={themeConfig} 
        themeStyles={themeStyles}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleImageClick={handleImageClick}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        formatWeddingDateTime={formatWeddingDateTime}
        navigate={navigate}
        slug={slug}
        giftImages={giftImages}
        t={t}
      />
    </Suspense>
  );
}
