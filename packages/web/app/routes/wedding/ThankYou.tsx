import { Link, useParams, useLocation, useNavigate } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { HeartIcon, PartyPopper } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "~/context/translation"
import { getThemeConfig, getThemeStyles } from "~/utils/themes"

interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  totalContributed: number;
  imageUrl: string | null;
  isFullyFunded: boolean;
  giftId: string;
}

interface Wedding {
  weddingId: string;
  title: string;
  userId: string;
  language?: "en" | "sv";
  theme?: string;
  primaryColor?: string;
  languageSettings?: {
    language: "en" | "sv"
  };
}

export default function ThankYouPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, setLanguage } = useTranslation()
  const location = useLocation()
  const [gift, setGift] = useState<Gift | null>(null)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [giftLoading, setGiftLoading] = useState(true)
  
  // Get giftId and theme data from location state (passed from Contribute page)
  const giftId = location.state?.giftId
  const passedTheme = location.state?.theme
  const passedPrimaryColor = location.state?.primaryColor
  
  useEffect(() => {
    const fetchGiftData = async () => {
      if (!giftId || !slug) {
        setLoading(false)
        return
      }
      
      try {
        // First get the wedding data to get weddingId
        let weddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/custom-url/${slug}`, {
          method: 'GET'
        });

        if (weddingResponse.status === 404) {
          weddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/${slug}`, {
            method: 'GET'
          });
        }

        if (!weddingResponse.ok) {
          throw new Error('Failed to fetch wedding data');
        }

        const weddingData = await weddingResponse.json();
        setWedding(weddingData);
        setLoading(false); // Main page can now render with wedding data
        
        // Set language from wedding settings if available
        if (weddingData.language) {
          setLanguage(weddingData.language);
        } else if (weddingData.languageSettings?.language) {
          setLanguage(weddingData.languageSettings.language);
        }
        
        // Then get the gift data (this can happen in background)
        try {
          const giftResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/${giftId}?weddingId=${weddingData.weddingId}`, {
            method: 'GET'
          });

          if (giftResponse.ok) {
            const giftData = await giftResponse.json();
            setGift(giftData);
          }
        } catch (giftError) {
          console.error('Error fetching gift data:', giftError);
        } finally {
          setGiftLoading(false);
        }
      } catch (error) {
        console.error('Error fetching wedding data:', error);
        setLoading(false);
        setGiftLoading(false);
      }
    };

    fetchGiftData();
  }, [giftId, slug]);
  
  const progressPercentage = gift && gift.price ? Math.min((gift.totalContributed / gift.price) * 100, 100) : 0;
  
  // Apply theme - use passed data first, then fall back to fetched data
  const theme = passedTheme || wedding?.theme || 'classic';
  const color = passedPrimaryColor || wedding?.primaryColor || 'pink';
  const themeConfig = getThemeConfig(theme, color);
  const themeStyles = getThemeStyles(theme, color);
  
  return (
    <div 
      className="flex flex-col min-h-screen"
      style={passedTheme || (!loading && wedding) ? { 
        background: themeConfig.colors.background,
        ...themeStyles 
      } : {}}
    >
      <header 
        className="px-4 lg:px-6 h-14 flex items-center border-b"
        style={passedTheme || (!loading && wedding) ? { 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.accent 
        } : {}}
      >
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon 
            className="h-6 w-6" 
            style={passedTheme || (!loading && wedding) ? { color: themeConfig.colors.primary } : {}}
          />
          <span style={passedTheme || (!loading && wedding) ? { color: themeConfig.colors.text } : {}}>Our Dream Day</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <PartyPopper 
              className="h-16 w-16 mx-auto mb-6" 
              style={passedTheme || (!loading && wedding) ? { color: themeConfig.colors.primary } : {}}
            />
            <h1 
              className={`text-3xl font-bold mb-4 ${passedTheme || (!loading && wedding) ? themeConfig.fonts.heading : ''}`}
              style={passedTheme || (!loading && wedding) ? { color: themeConfig.colors.text } : {}}
            >
              {t('thankYou.title')}
            </h1>
            <p 
              className={`mb-8 ${passedTheme || (!loading && wedding) ? themeConfig.fonts.body : ''}`}
              style={passedTheme || (!loading && wedding) ? { color: themeConfig.colors.textSecondary } : {}}
            >
              {t('thankYou.description')}
            </p>
            
            {/* Progress Bar Section */}
            {giftLoading ? (
              <div className="mb-8">
                <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
              </div>
            ) : gift ? (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">{t('thankYou.contributionProgress')}</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-sm text-gray-600">{t('thankYou.gift')}: {gift.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('thankYou.progress')}</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={passedTheme || (!loading && wedding) ? { 
                          width: `${progressPercentage}%`,
                          backgroundColor: themeConfig.colors.primary
                        } : { width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{gift.totalContributed} {t('thankYou.sekContributed')}</span>
                      <span>{gift.price} {t('thankYou.sekGoal')}</span>
                    </div>
                  </div>
                  {gift.isFullyFunded && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        🎉 {t('thankYou.fullyFunded')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            
            <div className="flex justify-center">
              <Button 
                className="text-white border-0"
                style={passedTheme || (!loading && wedding) ? { 
                  backgroundColor: themeConfig.colors.primary,
                  borderColor: themeConfig.colors.primary 
                } : {}}
                onMouseEnter={passedTheme || (!loading && wedding) ? (e) => {
                  e.currentTarget.style.backgroundColor = themeConfig.colors.primaryHover;
                } : undefined}
                onMouseLeave={passedTheme || (!loading && wedding) ? (e) => {
                  e.currentTarget.style.backgroundColor = themeConfig.colors.primary;
                } : undefined}
                onClick={() => navigate(`/${slug}`, {
                  state: {
                    theme: passedTheme || wedding?.theme,
                    primaryColor: passedPrimaryColor || wedding?.primaryColor
                  }
                })}
              >
                {t('thankYou.returnToWeddingPage')}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Our Dream Day. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
