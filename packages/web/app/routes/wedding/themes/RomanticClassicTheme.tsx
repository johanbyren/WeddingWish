import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { HeartIcon, Calendar, MapPin, ChevronLeft, ChevronRight, Camera, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog"
import type { ThemeComponentProps } from "./types"

export default function RomanticClassicTheme({
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
      className="min-h-screen"
      style={{ 
        background: themeConfig.colors.background,
        color: themeConfig.colors.text,
        ...themeStyles 
      }}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Image */}
        {wedding.photoUrls.find(url => url.includes('cover-')) && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${wedding.photoUrls.find(url => url.includes('cover-'))})` 
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{ background: themeConfig.styles.heroGradient }}
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-white/15 to-white/5 rounded-full shadow-lg" style={{ maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)' }}></div>
            <div className="relative z-10 p-12">
            <HeartIcon 
              className="w-12 h-12 mx-auto mb-6 animate-pulse text-white drop-shadow-lg" 
              style={{ color: themeConfig.colors.primary }}
            />
            <h1 
              className={`text-6xl md:text-8xl mb-4 text-balance ${themeConfig.fonts.heading} text-white drop-shadow-lg`}
            >
              {wedding.title}
            </h1>
            <div 
              className="w-24 h-px mx-auto mb-6 bg-white/80"
            />
            <p 
              className={`text-xl md:text-2xl tracking-wide ${themeConfig.fonts.accent} text-white/90 drop-shadow-md`}
            >
              {wedding.story ? wedding.story.substring(0, 100) + (wedding.story.length > 100 ? '...' : '') : t('weddingPage.joinUs')}
            </p>
            </div>
          </div>

          <div className="relative mt-12">
            <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-full shadow-md" style={{ maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)' }}></div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-8 py-4">
            <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">{formatWeddingDateTime(wedding.date, wedding.time).date}</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/60" />
            <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
              <MapPin className="w-5 h-5" />
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:underline cursor-pointer hover:text-white transition-colors"
                title={`View ${wedding.location} on Google Maps`}
              >
                {wedding.location}
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className={`text-4xl md:text-5xl mb-4 ${themeConfig.fonts.heading}`}
              style={{ color: themeConfig.colors.text }}
            >
              {t('weddingPage.ourSpecialDay')}
            </h2>
            <p 
              className={`text-lg max-w-2xl mx-auto text-balance ${themeConfig.fonts.body}`}
              style={{ color: themeConfig.colors.textSecondary }}
            >
              {t('weddingPage.joinUsDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              className={`p-8 text-center ${themeConfig.styles.borderRadius} ${themeConfig.animations.transition}`}
              style={{ 
                backgroundColor: themeConfig.colors.card,
                borderColor: themeConfig.colors.cardBorder,
                boxShadow: themeConfig.styles.cardShadow
              }}
            >
              <Calendar 
                className="w-12 h-12 mx-auto mb-6" 
                style={{ color: themeConfig.colors.primary }}
              />
              <h3 
                className={`text-2xl mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.when')}
              </h3>
              <div className="space-y-2" style={{ color: themeConfig.colors.textSecondary }}>
                <p className="text-lg font-medium">{formatWeddingDateTime(wedding.date, wedding.time).date}</p>
                <p>{t('weddingPage.ceremony')}: {formatWeddingDateTime(wedding.date, wedding.time).time}</p>
              </div>
            </Card>

            <Card 
              className={`p-8 text-center ${themeConfig.styles.borderRadius} ${themeConfig.animations.transition}`}
              style={{ 
                backgroundColor: themeConfig.colors.card,
                borderColor: themeConfig.colors.cardBorder,
                boxShadow: themeConfig.styles.cardShadow
              }}
            >
              <MapPin 
                className="w-12 h-12 mx-auto mb-6" 
                style={{ color: themeConfig.colors.primary }}
              />
              <h3 
                className={`text-2xl mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.where')}
              </h3>
              <div className="space-y-2" style={{ color: themeConfig.colors.textSecondary }}>
                <p className="text-lg font-medium">{wedding.location}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline cursor-pointer"
                >
                  {t('weddingPage.viewOnMaps')}
                </a>
              </div>
            </Card>

            <Card 
              className={`p-8 text-center ${themeConfig.styles.borderRadius} ${themeConfig.animations.transition}`}
              style={{ 
                backgroundColor: themeConfig.colors.card,
                borderColor: themeConfig.colors.cardBorder,
                boxShadow: themeConfig.styles.cardShadow
              }}
            >
              <HeartIcon 
                className="w-12 h-12 mx-auto mb-6" 
                style={{ color: themeConfig.colors.primary }}
              />
              <h3 
                className={`text-2xl mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.ourStory')}
              </h3>
              <div className="space-y-2" style={{ color: themeConfig.colors.textSecondary }}>
                <p className="text-lg font-medium">{t('weddingPage.loveStory')}</p>
                <p>{wedding.story ? wedding.story.substring(0, 50) + '...' : t('weddingPage.celebrateWithUs')}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      {wedding.photoUrls.filter(url => url.includes('gallery-')).length > 0 && (
        <section 
          className="py-20 px-4"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Camera 
                className="w-12 h-12 mx-auto mb-6" 
                style={{ color: themeConfig.colors.primary }}
              />
              <h2 
                className={`text-4xl md:text-5xl mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.ourJourney')}
              </h2>
              <p 
                className={`text-lg max-w-2xl mx-auto text-balance ${themeConfig.fonts.body}`}
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {t('weddingPage.journeyDescription')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wedding.photoUrls
                .filter(url => url.includes('gallery-'))
                .map((photoUrl, index) => (
                <div 
                  key={photoUrl} 
                  className={`aspect-square overflow-hidden cursor-pointer ${themeConfig.styles.borderRadius} ${themeConfig.animations.hover}`}
                  onClick={() => handleImageClick(photoUrl)}
                  style={{ backgroundColor: themeConfig.colors.muted }}
                >
                  <img
                    src={photoUrl}
                    alt={`${wedding.title} photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Registry Section */}
      {gifts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Gift 
                className="w-12 h-12 mx-auto mb-6" 
                style={{ color: themeConfig.colors.primary }}
              />
              <h2 
                className={`text-4xl md:text-5xl mb-4 ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('weddingPage.giftRegistry')}
              </h2>
              <p 
                className={`text-lg max-w-2xl mx-auto text-balance ${themeConfig.fonts.body}`}
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {t('weddingPage.giftRegistryDescription')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {gifts.map((gift) => (
                <Card 
                  key={gift.giftId}
                  className={`${themeConfig.styles.borderRadius} ${themeConfig.animations.transition} ${themeConfig.animations.hover}`}
                  style={{ 
                    backgroundColor: themeConfig.colors.card,
                    borderColor: themeConfig.colors.cardBorder,
                    boxShadow: themeConfig.styles.cardShadow
                  }}
                >
                  <div 
                    className={`aspect-video overflow-hidden ${themeConfig.styles.borderRadius}`}
                    style={{ backgroundColor: themeConfig.colors.muted }}
                  >
                    <img
                      src={giftImages[gift.giftId] || "/placeholder.svg?height=200&width=400"}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle 
                      className={themeConfig.fonts.heading}
                      style={{ color: themeConfig.colors.text }}
                    >
                      {gift.name}
                    </CardTitle>
                    <CardDescription 
                      className={themeConfig.fonts.body}
                      style={{ color: themeConfig.colors.textSecondary }}
                    >
                      {gift.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span 
                          className="text-sm"
                          style={{ color: themeConfig.colors.textSecondary }}
                        >
                          {gift.totalContributed} {t('weddingPage.sekOf')} {gift.price} {t('weddingPage.sek')}
                        </span>
                        <span 
                          className="text-sm font-medium"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {Math.round((gift.totalContributed / gift.price) * 100)}%
                        </span>
                      </div>
                      <div 
                        className="w-full rounded-full h-2"
                        style={{ backgroundColor: themeConfig.colors.muted }}
                      >
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((gift.totalContributed / gift.price) * 100, 100)}%`,
                            backgroundColor: themeConfig.colors.primary
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full text-white border-0 ${themeConfig.animations.transition}`}
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
      )}

      {/* Full Story Section */}
      {wedding.story && (
        <section 
          className="py-20 px-4"
          style={{ backgroundColor: themeConfig.colors.secondary }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className={`text-4xl md:text-5xl mb-8 ${themeConfig.fonts.heading}`}
              style={{ color: themeConfig.colors.text }}
            >
              {t('weddingPage.story')}
            </h2>
            <p 
              className={`text-lg leading-relaxed ${themeConfig.fonts.body}`}
              style={{ color: themeConfig.colors.textSecondary }}
            >
              {wedding.story}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer 
        className="py-12 px-4 border-t"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.cardBorder 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <HeartIcon 
              className="w-8 h-8 mx-auto mb-4" 
              style={{ color: themeConfig.colors.primary }}
            />
            <h3 
              className={`text-2xl mb-2 ${themeConfig.fonts.heading}`}
              style={{ color: themeConfig.colors.text }}
            >
              {wedding.title}
            </h3>
            <p 
              className={themeConfig.fonts.body}
              style={{ color: themeConfig.colors.textSecondary }}
            >
              {t('weddingPage.thankYou')}
            </p>
          </div>

          <div 
            className="text-sm space-y-1"
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
  );
}
