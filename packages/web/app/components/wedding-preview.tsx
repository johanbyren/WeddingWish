import { Suspense, useState } from "react"
import { getThemeComponent } from "~/routes/wedding/themes"
import { getThemeConfig, getThemeStyles } from "~/utils/themes"
import { useTranslation, translations } from "~/context/translation"
import type { Wedding, Gift } from "~/routes/wedding/themes/types"

interface WeddingPreviewProps {
  weddingDetails: {
    title: string
    date: Date
    time: string
    location: string
    story: string
    coverPhotoPreview: string
    additionalPhotos: { file: File | null; preview: string }[]
    giftItems: {
      id: string
      giftId?: string
      name: string
      description: string
      price: string
      imageFile: File | null
      imagePreview: string
    }[]
    theme: string
    primaryColor: string
    language: "en" | "sv"
  }
}

export default function WeddingPreview({ weddingDetails }: WeddingPreviewProps) {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Create a translation function that uses the wedding's language
  // This uses the global translations but with a specific language parameter
  const getTranslation = (key: string) => {
    const currentLanguage = weddingDetails.language || 'en';
    
    // Use the exported translations object directly
    // This is much cleaner and avoids duplication
    return (translations[currentLanguage] as any)?.[key] || key;
  };

  // Convert weddingDetails to the format expected by theme components
  const mockWedding: Wedding = {
    weddingId: "preview",
    userId: "preview",
    title: weddingDetails.title || getTranslation('create.yourWeddingTitle'),
    date: weddingDetails.date.toISOString().split('T')[0],
    time: weddingDetails.time,
    location: weddingDetails.location || getTranslation('create.weddingLocation'),
    story: weddingDetails.story || getTranslation('create.loveStoryPlaceholder'),
    photoUrls: [
      ...(weddingDetails.coverPhotoPreview ? [weddingDetails.coverPhotoPreview] : []),
      ...weddingDetails.additionalPhotos.map(photo => photo.preview)
    ],
    visibility: "public",
    customUrl: "preview",
    theme: weddingDetails.theme,
    primaryColor: weddingDetails.primaryColor,
    language: weddingDetails.language
  }

  // Convert gift items to the format expected by theme components
  const mockGifts: Gift[] = weddingDetails.giftItems.map(item => ({
    giftId: item.id,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price) || 0,
    totalContributed: 0,
    isFullyFunded: false,
    imageUrl: item.imagePreview || null
  }))

  // Create gift images mapping
  const giftImages: Record<string, string> = {}
  weddingDetails.giftItems.forEach(item => {
    if (item.imagePreview) {
      giftImages[item.id] = item.imagePreview
    }
  })

  const theme = weddingDetails.theme || 'classic'
  const color = weddingDetails.primaryColor || 'pink'
  const themeConfig = getThemeConfig(theme, color)
  const themeStyles = getThemeStyles(theme, color)

  // Get the appropriate theme component
  const ThemeComponent = getThemeComponent(theme)

  const handleImageClick = (photoUrl: string) => {
    setSelectedImage(photoUrl)
    const galleryPhotos = weddingDetails.additionalPhotos.map(photo => photo.preview)
    setCurrentImageIndex(galleryPhotos.indexOf(photoUrl))
  }

  const handlePreviousImage = () => {
    const galleryPhotos = weddingDetails.additionalPhotos.map(photo => photo.preview)
    const newIndex = (currentImageIndex - 1 + galleryPhotos.length) % galleryPhotos.length
    setCurrentImageIndex(newIndex)
    setSelectedImage(galleryPhotos[newIndex])
  }

  const handleNextImage = () => {
    const galleryPhotos = weddingDetails.additionalPhotos.map(photo => photo.preview)
    const newIndex = (currentImageIndex + 1) % galleryPhotos.length
    setCurrentImageIndex(newIndex)
    setSelectedImage(galleryPhotos[newIndex])
  }

  const formatWeddingDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString()
    
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

  const navigate = (path: string, options?: any) => {
    // Mock navigate function for preview
    console.log('Navigate to:', path, options)
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="h-[600px] overflow-y-auto">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading preview...</div>}>
          <ThemeComponent
            wedding={mockWedding}
            gifts={mockGifts}
            themeConfig={themeConfig}
            themeStyles={themeStyles}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleImageClick={handleImageClick}
            handlePreviousImage={handlePreviousImage}
            handleNextImage={handleNextImage}
            formatWeddingDateTime={formatWeddingDateTime}
            navigate={navigate}
            slug="preview"
            giftImages={giftImages}
            t={getTranslation}
          />
        </Suspense>
      </div>
    </div>
  )
}
