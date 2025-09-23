import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Slider } from "~/components/ui/slider"
import { HeartIcon } from "lucide-react"
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from "~/context/translation"
import { FullScreenLoading } from "~/components/loading-spinner"
import { getThemeConfig, getThemeStyles } from "~/utils/themes"

import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
  paymentSettings?: any;
  languageSettings?: {
    language: "en" | "sv"
  };
}

export default function ContributePage() {
  const { slug, giftId } = useParams()
  const location = useLocation()
  const { t, setLanguage } = useTranslation()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("50")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [gift, setGift] = useState<Gift | null>(null)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get theme data from location state (passed from Wedding page)
  const passedTheme = location.state?.theme
  const passedPrimaryColor = location.state?.primaryColor
  const [error, setError] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showSwishQR, setShowSwishQR] = useState(false);
  const [swishQRString, setSwishQRString] = useState('');
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [swishDonationError, setSwishDonationError] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                index + 1 <= currentStep
                  ? 'text-white'
                  : 'text-gray-500 bg-gray-200'
              }`}
              style={{
                backgroundColor: index + 1 <= currentStep 
                  ? themeConfig.colors.primary 
                  : '#e5e7eb'
              }}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  index + 1 < currentStep
                    ? ''
                    : 'bg-gray-200'
                }`}
                style={{
                  backgroundColor: index + 1 < currentStep 
                    ? themeConfig.colors.primary 
                    : '#e5e7eb'
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Helper function to reset QR state
  const resetQRState = () => {
    setShowSwishQR(false);
    setSwishQRString('');
    setIsGeneratingQR(false);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setShowCheckout(false); // Reset checkout when amount changes
    setClientSecret(null);
    resetQRState(); // Reset Swish QR when amount changes
  };

  // Function to refresh gift data after donation
  const refreshGiftData = async () => {
    if (!giftId || !wedding?.weddingId) return;
    
    try {
      const giftResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/${giftId}?weddingId=${wedding.weddingId}`, {
        method: 'GET'
      });

      if (giftResponse.ok) {
        const updatedGiftData = await giftResponse.json();
        setGift(updatedGiftData);
        console.log('Gift data refreshed:', updatedGiftData);
      }
    } catch (error) {
      console.error('Failed to refresh gift data:', error);
    }
  };

  const handlePayClick = async () => {
    if (!gift?.giftId) {
      console.error('Gift data:', gift);
      throw new Error('This gift is not properly configured. Please contact the wedding organizers.');
    }

    setIsProcessing(true);
    try {
      // Create a Checkout Session
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftId: gift.giftId,
          amount: parseFloat(amount),
          returnUrl: `${window.location.origin}/${slug}/thank-you`,
          userId: wedding?.userId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get swish phone number from wedding.paymentSettings
  const swishPhoneNumber = (wedding as any)?.paymentSettings?.swishPhoneNumber || '';
  const paymentMethod = (wedding as any)?.paymentSettings?.paymentMethod || 'swish';

  // Debug logging to verify payment method detection
  console.log('Payment method detected:', paymentMethod);
  console.log('Swish phone number:', swishPhoneNumber);
  console.log('Wedding payment settings:', (wedding as any)?.paymentSettings);

  const generateQRCode = () => {
    // Validate all required data is present
    if (!gift?.name || !swishPhoneNumber || !wedding?.weddingId) {
      console.error('Missing required data for QR generation:', {
        giftName: gift?.name,
        swishPhoneNumber,
        weddingId: wedding?.weddingId
      });
      return;
    }

    setShowSwishQR(false);
    setSwishQRString('');
    setIsGeneratingQR(true);

    // Remove any leading + from phone number and ensure country code is present
    let phone = swishPhoneNumber.replace(/^\+/, '');
    // If phone starts with 0, replace with 46
    if (phone.startsWith('0')) phone = '46' + phone.slice(1);
    
    // Build the message with donor info
    let message = `Bröllopspresent: ${gift.name}`;
    if (donorName) {
      message += ` från ${donorName}`;
    }
    if (donorMessage) {
      message += ` - ${donorMessage}`;
    }
    
    // Ensure message doesn't exceed Swish's character limit (50 chars)
    if (message.length > 50) {
      message = message.substring(0, 47) + '...';
    }
    
    // Compose QR string
    const lockMask = '6';
    const qrCodeString = `C${phone};${amount};${message};${lockMask}`;

    console.log('Generating QR code with data:', {
      phone,
      amount,
      message,
      qrCodeString
    });

    // Set the QR string first, then show the QR code after a small delay
    setSwishQRString(qrCodeString);
    
    // Small delay to ensure QRCodeCanvas component is ready
    setTimeout(() => {
      setShowSwishQR(true);
      setIsGeneratingQR(false);
    }, 100);
  };

  const options = { clientSecret };

  useEffect(() => {
    const fetchData = async () => {
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
          throw new Error('Failed to fetch wedding data');
        }

        const weddingData = await response.json();
        console.log('Wedding data:', weddingData);
        setWedding(weddingData);
        
        // Set language from wedding settings if available
        if (weddingData.language) {
          setLanguage(weddingData.language);
        } else if (weddingData.languageSettings?.language) {
          setLanguage(weddingData.languageSettings.language);
        }

        // Fetch the specific gift
        const giftResponse = await fetch(`${import.meta.env.VITE_API_URL}api/show-gift/${giftId}?weddingId=${weddingData.weddingId}`, {
          method: 'GET'
        });

        if (!giftResponse.ok) {
          throw new Error('Failed to fetch gift data');
        }

        const giftData = await giftResponse.json();
        console.log('Gift data:', giftData);
        setGift(giftData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug && giftId) {
      fetchData();
    }
  }, [slug, giftId]);

  if (loading) {
    return (
      <FullScreenLoading 
        text={t('loading.giftDetails')} 
        theme={passedTheme || wedding?.theme}
        primaryColor={passedPrimaryColor || wedding?.primaryColor}
      />
    );
  }

  if (error || !gift || !wedding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{t('weddingPage.error')}</h2>
          <p className="mt-2 text-gray-600">{error || t('contribute.giftNotFound')}</p>
          <Link to={`/${slug}`} className="block">
            <Button className="w-full mt-4">
              {t('contribute.backToWeddingPage')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Apply theme - use passed data first, then fall back to fetched data
  const theme = passedTheme || wedding?.theme || 'classic';
  const color = passedPrimaryColor || wedding?.primaryColor || 'pink';
  const themeConfig = getThemeConfig(theme, color);
  const themeStyles = getThemeStyles(theme, color);

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
        <div className="container px-4 md:px-6 py-12 mx-auto">
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 items-start">
            {/* Left: Info/Context Section */}
            <div 
              className="rounded-xl shadow p-6 flex flex-col items-center"
              style={{ 
                backgroundColor: 'white',
                borderColor: themeConfig.colors.accent,
                boxShadow: themeConfig.styles.shadow
              }}
            >
              <h3 
                className={`text-xl font-bold mb-2 text-center ${themeConfig.fonts.heading}`}
                style={{ color: themeConfig.colors.text }}
              >
                {t('contribute.title')}
              </h3>
              <p 
                className={`mb-4 text-center ${themeConfig.fonts.body}`}
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {t('contribute.description')}
              </p>
              <div className="flex flex-col items-center gap-1 text-sm mb-4">
                <span>{t('contribute.alreadyContributed')}: <strong>{gift.totalContributed} {t('weddingPage.sek')}</strong></span>
              </div>
              {paymentMethod === 'swish' ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="text-xs text-gray-500">{t('contribute.securePaymentSwish')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <img src="/stripe_logo.png" alt="Stripe" className="h-5" />
                  <span className="text-xs text-gray-500">{t('contribute.securePaymentStripe')}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1 text-center">
                {paymentMethod === 'swish' 
                  ? t('contribute.scanQRCode')
                  : t('contribute.paymentEncrypted')
                }
              </p>
            </div>

            {/* Right: Step-by-Step Payment Section */}
            <div 
              className="rounded-xl shadow p-6 flex flex-col items-center"
              style={{ 
                backgroundColor: 'white',
                borderColor: themeConfig.colors.accent,
                boxShadow: themeConfig.styles.shadow
              }}
            >
              <div className="w-full max-w-md space-y-6">
                {/* Progress Indicator */}
                <ProgressIndicator />
                
                {paymentMethod === 'swish' ? (
                  // Swish Step-by-Step Flow
                  <>
                    {/* Step 1: Amount */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                            {t('contribute.step1Title')}
                          </h3>
                          <p className="text-sm" style={{ color: themeConfig.colors.textSecondary }}>
                            {t('contribute.step1Description')}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <Label htmlFor="amount">{t('contribute.contributionAmount')}</Label>
                          <div className="space-y-2">
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              value={amount}
                              onChange={(e) => { handleAmountChange(e.target.value); }}
                              className="w-full"
                            />
                            <Slider
                              value={[parseFloat(amount)]}
                              min={1}
                              max={5000}
                              step={1}
                              onValueChange={(value: number[]) => { handleAmountChange(value[0].toString()); }}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          onClick={nextStep}
                          disabled={!amount || parseFloat(amount) < 1}
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
                        >
                          {t('contribute.next')}
                        </Button>
                      </div>
                    )}
                    
                    {/* Step 2: Name and Message */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                            {t('contribute.step2Title')}
                          </h3>
                          <p className="text-sm" style={{ color: themeConfig.colors.textSecondary }}>
                            {t('contribute.step2Description')}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <Label htmlFor="donorName">{t('contribute.yourName')}</Label>
                          <Input
                            id="donorName"
                            value={donorName}
                            onChange={(e) => { setDonorName(e.target.value); resetQRState(); }}
                            placeholder={t('contribute.enterYourName')}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <Label htmlFor="donorMessage">{t('contribute.message')}</Label>
                          <Input
                            id="donorMessage"
                            value={donorMessage}
                            onChange={(e) => { setDonorMessage(e.target.value); resetQRState(); }}
                            placeholder={t('contribute.addPersonalMessage')}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1"
                            style={{ 
                              borderColor: themeConfig.colors.primary,
                              color: themeConfig.colors.primary
                            }}
                          >
                            {t('contribute.back')}
                          </Button>
                          <Button 
                            onClick={() => {
                              generateQRCode();
                              nextStep();
                            }}
                            disabled={isGeneratingQR}
                            className="flex-1 text-white border-0"
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
                          >
                            {isGeneratingQR ? t('contribute.generatingQR') : t('contribute.next')}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: QR Code */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                            {t('contribute.step3Title')}
                          </h3>
                          <p className="text-sm" style={{ color: themeConfig.colors.textSecondary }}>
                            {t('contribute.step3Description')}
                          </p>
                        </div>
                        
                        {showSwishQR && swishQRString && (
                          <div className="flex flex-col items-center">
                            <QRCodeCanvas 
                              key={swishQRString} 
                              value={swishQRString} 
                              size={200}
                              level="M"
                              includeMargin={true}
                            />
                            <p className="mt-4 text-center text-gray-700 text-sm">
                              {t('contribute.scanQRCodeWithSwish')}<br/>
                              {t('contribute.phone')}: <b>{swishPhoneNumber}</b><br/>
                              {t('contribute.amount')}: <b>{amount} SEK</b><br/>
                              {t('contribute.message')}: <b>{donorName ? `Wedding gift: ${gift.name} (from ${donorName})` : `Wedding gift: ${gift.name}`}{donorMessage ? ` - ${donorMessage}` : ''}</b>
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1"
                            style={{ 
                              borderColor: themeConfig.colors.primary,
                              color: themeConfig.colors.primary
                            }}
                          >
                            {t('contribute.back')}
                          </Button>
                          <Button
                            onClick={async () => {
                              setSwishDonationError(null);
                              try {
                                const res = await fetch(`${import.meta.env.VITE_API_URL}api/swish-donation`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    weddingId: wedding?.weddingId,
                                    giftId: gift?.giftId,
                                    amount: parseFloat(amount),
                                    donorName,
                                    message: donorMessage,
                                    phone: swishPhoneNumber,
                                  })
                                });
                                if (!res.ok) throw new Error("Failed to save Swish donation");
                                // Refresh gift data to show updated progress
                                await refreshGiftData();
                                // Redirect to thank you page with gift data and theme
                                navigate(`/${slug}/thank-you`, { 
                                  state: { 
                                    giftId: gift?.giftId,
                                    theme: wedding?.theme,
                                    primaryColor: wedding?.primaryColor
                                  } 
                                });
                              } catch (err) {
                                setSwishDonationError("Could not save your donation. Please try again.");
                              }
                            }}
                            className="flex-1 text-white border-0"
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
                          >
                            {t('contribute.finish')}
                          </Button>
                        </div>
                        
                        {swishDonationError && (
                          <p className="text-red-600 text-center text-sm">{t('contribute.couldNotSaveDonation')}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  // Stripe Payment Flow (keeping original for now)
                  <>
                    {!showCheckout ? (
                      <>
                        <div className="space-y-4">
                          <Label htmlFor="amount">{t('contribute.contributionAmount')}</Label>
                          <div className="space-y-2">
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              value={amount}
                              onChange={(e) => handleAmountChange(e.target.value)}
                              className="w-full"
                            />
                            <Slider
                              value={[parseFloat(amount)]}
                              min={1}
                              max={1000}
                              step={1}
                              onValueChange={(value: number[]) => handleAmountChange(value[0].toString())}
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handlePayClick}
                          disabled={isProcessing}
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
                        >
                          {isProcessing ? t('contribute.processing') : t('contribute.payNow')}
                        </Button>
                      </>
                    ) : (
                      <div className="w-full">
                        {clientSecret && (
                          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                            <EmbeddedCheckout />
                          </EmbeddedCheckoutProvider>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}
