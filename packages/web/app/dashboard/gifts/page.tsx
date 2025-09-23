"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { HeartIcon, ImagePlus } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { ProgressBar } from "~/components/progress-bar"
import { ContributorList } from "~/components/contributor-list"
import { FullScreenLoading } from "~/components/loading-spinner"
import { useAuth } from "~/context/auth"
import { useTranslation } from "~/context/translation"

interface GiftItem {
  id: string
  giftId: string
  name: string
  description: string
  price: number
  imageFile: File | null
  imagePreview: string
  imageUrl?: string
  totalContributed: number
  isFullyFunded: boolean
}

interface Contributor {
  id: string
  contributorName: string
  amount: number
  message: string
  createdAt: string
  type: 'swish' | 'stripe'
}

export default function ManageGifts() {
  const auth = useAuth()
  const { t } = useTranslation()
  const [giftItems, setGiftItems] = useState<GiftItem[]>([])
  const [contributors, setContributors] = useState<Record<string, Contributor[]>>({})
  const [weddingId, setWeddingId] = useState<string>("")
  const [weddingTheme, setWeddingTheme] = useState<string>("")
  const [weddingPrimaryColor, setWeddingPrimaryColor] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load wedding ID and gifts when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Wait for auth to be ready
        if (!auth.user?.email) {
          return;
        }

        // Get wedding ID from user's weddings
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/${auth.user.email}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wedding ID');
        }

        const weddings = await response.json();
        
        if (!weddings || weddings.length === 0) {
          setError('No wedding found. Please create a wedding page first.');
          setLoading(false);
          return;
        }

        const wedding = weddings[0];
        const weddingId = wedding.weddingId;
        setWeddingId(weddingId);
        
        // Store theme information for loading component
        setWeddingTheme(wedding.theme || "");
        setWeddingPrimaryColor(wedding.primaryColor || "");

        // Load gifts
        await loadGifts(weddingId);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again.');
        setTimeout(() => {
          setError(null);
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth.user?.email, auth.getToken]);

  const loadGifts = async (weddingId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/wedding/${weddingId}`, {
        headers: {
          Authorization: `Bearer ${await auth.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }

      const gifts = await response.json();
      setGiftItems(gifts);

      // Load contributions for each gift
      const contributionsData: Record<string, Contributor[]> = {};
      for (const gift of gifts) {
        try {
          const contribResponse = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/${gift.giftId}/contributions?weddingId=${weddingId}`, {
            headers: {
              Authorization: `Bearer ${await auth.getToken()}`,
            },
          });
          
          if (contribResponse.ok) {
            const contributions = await contribResponse.json();
            contributionsData[gift.giftId] = contributions;
          } else {
            contributionsData[gift.giftId] = [];
          }
        } catch (error) {
          console.error(`Failed to load contributions for gift ${gift.giftId}:`, error);
          contributionsData[gift.giftId] = [];
        }
      }
      setContributors(contributionsData);
    } catch (error) {
      console.error('Error loading gifts:', error);
      setError('Failed to load gifts. Please try again.');
    }
  };


  if (loading) {
    return <FullScreenLoading 
      text={t('loading.giftRegistry')} 
      theme={weddingTheme || "classic"}
      primaryColor={weddingPrimaryColor || "#ec4899"}
    />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {error.includes('No wedding found') ? (
            <Link to="/dashboard/create" className="block">
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Create Wedding Page
              </Button>
            </Link>
          ) : (
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{t('gifts.overview')}</h1>
            <div className="text-sm text-gray-500">
              {t('gifts.readOnlyInfo')}
            </div>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}


          {/* Gift Registry Overview */}
          {giftItems.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-gray-500">{t('gifts.noContributions')}</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {giftItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Gift Header */}
                      <div className="border-b pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{t('gifts.targetAmount')}</div>
                            <div className="text-lg font-semibold text-gray-900">{item.price.toLocaleString()} SEK</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <ProgressBar 
                            current={item.totalContributed} 
                            target={item.price}
                          />
                        </div>
                      </div>

                      {/* Contributors Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          {t('gifts.contributors')} ({contributors[item.giftId]?.length || 0})
                        </h4>
                        <ContributorList 
                          contributors={contributors[item.giftId] || []}
                          showAmounts={true}
                          maxDisplay={10}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}