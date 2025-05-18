import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { HeartIcon } from "lucide-react"

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
  stripePriceId?: string;
}

interface Wedding {
  weddingId: string;
  title: string;
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

  const fetchClientSecret = useCallback(() => {
    if (!gift?.stripePriceId) {
      console.error('Gift data:', gift);
      throw new Error('This gift is not properly configured for payments. Please contact the wedding organizers.');
    }

    // Create a Checkout Session
    return fetch(`${import.meta.env.VITE_API_URL}api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: gift.stripePriceId,
        quantity: 1,
        returnUrl: `${window.location.origin}/${slug}/thank-you`,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }
        return data.clientSecret;
      });
  }, [gift?.stripePriceId, slug]);

  const options = {fetchClientSecret};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftId,
          amount: parseFloat(amount),
          name,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process contribution');
      }

      navigate(`/${slug}/thank-you`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  }

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

  if (!gift.stripePriceId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Payment Not Available</h2>
          <p className="mt-2 text-gray-600">This gift is not properly configured for payments. Please contact the wedding organizers.</p>
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
              <div className="flex items-center gap-2 mt-2">
                <img src="/stripe_logo.png" alt="Stripe" className="h-5" />
                <span className="text-xs text-gray-500">Secure payment by Stripe</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Your payment is encrypted and securely processed. We never store your card details.
              </p>
            </div>

            {/* Right: Payment Section */}
            <div className="rounded-xl shadow bg-white p-6 flex flex-col items-center">
              <div className="w-full max-w-md">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
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
  )
}
