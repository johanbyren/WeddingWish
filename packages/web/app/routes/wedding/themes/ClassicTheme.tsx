import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { HeartIcon, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog"
import type { ThemeComponentProps } from "./types"

export default function ClassicTheme({
  wedding,
  gifts,
  themeConfig,
  themeStyles,
  selectedImage,
  setSelectedImage,
  handleImageClick,
  handlePreviousImage,
  handleNextImage,
  formatWeddingDateTime,
  navigate,
  slug,
  giftImages,
  t
}: ThemeComponentProps) {
  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ 
        background: themeConfig.colors.background,
        ...themeStyles 
      }}
    >
      <header 
        className="px-4 lg:px-6 h-14 flex items-center border-b"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.accent 
        }}
      >
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon 
            className="h-6 w-6" 
            style={{ color: themeConfig.colors.primary }}
          />
          <span style={{ color: themeConfig.colors.text }}>Our Dream Day</span>
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
              <h2 
                className={`text-2xl font-bold mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.story')}
              </h2>
              <p 
                className={`leading-relaxed ${themeConfig.fonts.body}`}
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {wedding.story}
              </p>
            </div>
          </div>
        </section>

        {wedding.photoUrls.length > 0 && (
          <section className="py-12">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 
                  className={`text-2xl font-bold mb-6 ${themeConfig.fonts.heading}`}
                  style={{ color: themeConfig.colors.text }}
                >
                  {t('weddingPage.photoGallery')}
                </h2>
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

        <section 
          className="py-12"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 
                className={`text-2xl font-bold ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.giftRegistry')}
              </h2>
              <p 
                className={`mt-2 ${themeConfig.fonts.body}`}
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {t('weddingPage.giftRegistryDescription')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {gifts.map((gift) => (
                <Card 
                  key={gift.giftId}
                  className={themeConfig.styles.borderRadius}
                  style={{ 
                    borderColor: themeConfig.colors.accent,
                    boxShadow: themeConfig.styles.shadow
                  }}
                >
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(gift.totalContributed / gift.price) * 100}%`,
                            backgroundColor: themeConfig.colors.primary
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full text-white border-0"
                      style={{ 
                        backgroundColor: themeConfig.colors.primary,
                        borderColor: themeConfig.colors.primary 
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeConfig.colors.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = themeConfig.colors.primary;
                      }}
                      onClick={() => navigate(`/${slug}/contribute/${gift.giftId}`, {
                        state: {
                          theme: wedding?.theme,
                          primaryColor: wedding?.primaryColor
                        }
                      })}
                    >
                      {t('weddingPage.contribute')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer 
        className="border-t py-6"
        style={{ borderColor: themeConfig.colors.accent }}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div 
            className="text-center text-sm"
            style={{ color: themeConfig.colors.textSecondary }}
          >
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
