import { Link, useParams, useLocation } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { HeartIcon, PartyPopper } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "~/context/translation"

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

export default function ThankYouPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const location = useLocation()
  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get giftId from location state (passed from Contribute page)
  const giftId = location.state?.giftId
  
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
        
        // Then get the gift data
        const giftResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/${giftId}?weddingId=${weddingData.weddingId}`, {
          method: 'GET'
        });

        if (giftResponse.ok) {
          const giftData = await giftResponse.json();
          setGift(giftData);
        }
      } catch (error) {
        console.error('Error fetching gift data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftData();
  }, [giftId, slug]);
  
  const progressPercentage = gift && gift.price ? Math.min((gift.totalContributed / gift.price) * 100, 100) : 0;
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-pink-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <PartyPopper className="h-16 w-16 mx-auto text-pink-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">{t('thankYou.title')}</h1>
            <p className="text-gray-700 mb-8">
{t('thankYou.description')}
            </p>
            
            {/* Progress Bar Section */}
            {loading ? (
              <div className="mb-8">
                <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
              </div>
            ) : gift ? (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Contribution Progress</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-sm text-gray-600">Gift: {gift.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${gift.totalContributed} contributed</span>
                      <span>${gift.price} goal</span>
                    </div>
                  </div>
                  {gift.isFullyFunded && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        🎉 Fully Funded!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            
            <div className="flex justify-center">
              <Link to={`/${slug}`} className="block">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Return to Wedding Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 WeddingWish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
