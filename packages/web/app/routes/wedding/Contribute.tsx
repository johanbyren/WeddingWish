import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Slider } from "~/components/ui/slider"
import { HeartIcon } from "lucide-react"
import { QRCodeCanvas } from 'qrcode.react';

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
}

export default function ContributePage() {
  const { slug, giftId } = useParams()
  const navigate = useNavigate()
  const [amount, setAmount] = useState("50")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [gift, setGift] = useState<Gift | null>(null)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showSwishQR, setShowSwishQR] = useState(false);
  const [swishQRString, setSwishQRString] = useState('');
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [swishDonationSaved, setSwishDonationSaved] = useState(false);
  const [swishDonationError, setSwishDonationError] = useState<string | null>(null);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setShowCheckout(false); // Reset checkout when amount changes
    setClientSecret(null);
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
  const paymentMethod = (wedding as any)?.paymentSettings?.paymentMethod || 'stripe';

  // Debug logging to verify payment method detection
  console.log('Payment method detected:', paymentMethod);
  console.log('Swish phone number:', swishPhoneNumber);
  console.log('Wedding payment settings:', (wedding as any)?.paymentSettings);

  const handleSwishClick = () => {
    if (!gift?.name || !swishPhoneNumber) return;
    // Remove any leading + from phone number and ensure country code is present
    let phone = swishPhoneNumber.replace(/^\+/, '');
    // If phone starts with 0, replace with 46
    if (phone.startsWith('0')) phone = '46' + phone.slice(1);
    // Compose QR string
    const message = `Wedding gift: ${gift.name}`;
    const lockMask = '6';
    const qrCodeString = `C${phone};${amount};${message};${lockMask}`;

    setSwishQRString(qrCodeString);
    setShowSwishQR(true);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gift details...</p>
        </div>
      </div>
    );
  }

  if (error || !gift || !wedding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Gift not found'}</p>
          <Button asChild className="mt-4">
            <Link to={`/${slug}`}>Back to Wedding Page</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          <span>WeddingWish</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col bg-gradient-to-b from-white to-pink-50">
        <div className="container px-4 md:px-6 py-12 mx-auto">
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 items-start">
            {/* Left: Info/Context Section */}
            <div className="rounded-xl shadow bg-white p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold mb-2 text-center">Contribute to the Wedding Couple</h3>
              <p className="text-gray-600 mb-4 text-center">
                Your contribution will go directly to the couple and help make their day even more special.
              </p>
              <div className="flex flex-col items-center gap-1 text-sm mb-4">
                <span>Already contributed: <strong>${gift.totalContributed}</strong></span>
              </div>
              {paymentMethod === 'swish' ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="text-xs text-gray-500">Secure payment via Swish</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <img src="/stripe_logo.png" alt="Stripe" className="h-5" />
                  <span className="text-xs text-gray-500">Secure payment by Stripe</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1 text-center">
                {paymentMethod === 'swish' 
                  ? 'Scan the QR code with your Swish app to complete your contribution.'
                  : 'Your payment is encrypted and securely processed. We never store your card details.'
                }
              </p>
            </div>

            {/* Right: Payment Section */}
            <div className="rounded-xl shadow bg-white p-6 flex flex-col items-center">
              <div className="w-full max-w-md space-y-6">
                {paymentMethod === 'swish' ? (
                  // Swish Payment Flow
                  <>
                    <div className="space-y-4">
                      <Label htmlFor="amount">Contribution Amount (SEK)</Label>
                      <div className="space-y-2">
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          value={amount}
                          onChange={(e) => { handleAmountChange(e.target.value); setShowSwishQR(false); }}
                          className="w-full"
                        />
                        <Slider
                          value={[parseFloat(amount)]}
                          min={1}
                          max={5000}
                          step={1}
                          onValueChange={(value: number[]) => { handleAmountChange(value[0].toString()); setShowSwishQR(false); }}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSwishClick}
                      disabled={isProcessing || !swishPhoneNumber}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      {isProcessing ? 'Processing...' : 'Show Swish QR Code'}
                    </Button>
                    {showSwishQR && swishQRString && (
                      <div className="mt-6 flex flex-col items-center">
                        <QRCodeCanvas value={swishQRString} size={200} />
                        <p className="mt-4 text-center text-gray-700">Scan this QR code with your Swish app to complete your donation.<br/>Phone: <b>{swishPhoneNumber}</b><br/>Amount: <b>{amount} SEK</b><br/>Message: <b>Wedding gift: {gift.name}</b></p>
                        <div className="mt-4 w-full max-w-xs">
                          <Label htmlFor="donorName">Your Name (optional)</Label>
                          <Input
                            id="donorName"
                            value={donorName}
                            onChange={e => setDonorName(e.target.value)}
                            className="mb-2"
                          />
                          <Label htmlFor="donorMessage">Message (optional)</Label>
                          <Input
                            id="donorMessage"
                            value={donorMessage}
                            onChange={e => setDonorMessage(e.target.value)}
                            className="mb-2"
                          />
                          <Button
                            className="w-full mt-2 bg-pink-500 hover:bg-pink-600"
                            onClick={async () => {
                              setSwishDonationSaved(false);
                              setSwishDonationError(null);
                              try {
                                const res = await fetch("/api/swish-donation", {
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
                                setSwishDonationSaved(true);
                              } catch (err) {
                                setSwishDonationError("Could not save your donation. Please try again.");
                              }
                            }}
                          >
                            I've completed my Swish payment
                          </Button>
                          {swishDonationSaved && <p className="text-green-600 mt-2">Thank you! Your donation has been registered.</p>}
                          {swishDonationError && <p className="text-red-600 mt-2">{swishDonationError}</p>}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Stripe Payment Flow
                  <>
                    {!showCheckout ? (
                      <>
                        <div className="space-y-4">
                          <Label htmlFor="amount">Contribution Amount (SEK)</Label>
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
                          className="w-full"
                        >
                          {isProcessing ? 'Processing...' : 'Pay Now'}
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
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 WeddingWish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
