"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "~/context/auth"
import { useTranslation } from "~/context/translation"
import { OverlayLoading, ButtonLoadingSpinner } from "~/components/loading-spinner"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Check } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { SE, NO, DK, FI, GB, US, DE, FR } from 'country-flag-icons/react/3x2'
import { DatePicker } from "~/components/date-picker"
import { getCache, setCache, clearCache, isCacheValid } from "~/utils/cache"

interface SettingsData {
  accountSettings?: {
    name: string;
    email: string;
    partner1Name: string;
    partner2Name: string;
    weddingDate: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phoneNumber: {
      countryCode: string;
      number: string;
    };
  };
  paymentSettings?: {
    paymentMethod: string;
    accountEmail: string;
    notifyOnContribution: boolean;
    autoThankYou: boolean;
    stripeAccountId?: string;
    swishPhoneNumber?: string;
  };
  notificationSettings?: {
    emailNotifications: boolean;
    contributionAlerts: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
  };
  privacySettings?: {
    showContributorNames: boolean;
    showContributionAmounts: boolean;
    allowGuestComments: boolean;
    showRegistry: boolean;
  };
}

const CACHE_KEY = 'settings_cache';

export default function Settings() {
  const auth = useAuth();
  const { t, setLanguage } = useTranslation();
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [countrySearch, setCountrySearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState({
    account: false,
    payment: false,
    notification: false,
    privacy: false,
    all: false
  })
  const isFetchingRef = React.useRef(false);
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: "",
    email: "",
    partner1Name: "",
    partner2Name: "",
    weddingDate: new Date(),
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sweden"
    },
    phoneNumber: {
      countryCode: "+46",
      number: ""
    },
  })

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethod: "swish",
    accountEmail: auth.user?.email || "",
    notifyOnContribution: true,
    autoThankYou: true,
    stripeAccountId: undefined as string | undefined,
    swishPhoneNumber: "",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contributionAlerts: true,
    weeklyDigest: true,
    marketingEmails: true,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showContributorNames: true,
    showContributionAmounts: true,
    allowGuestComments: true,
    showRegistry: true,
  })


  // Add this after the other state declarations
  const [stripeConnectStatus, setStripeConnectStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);


  // Load settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.user?.email) return;
      setIsLoading(true);

      try {
        // Check cache first
        const cache = getCache<SettingsData>(CACHE_KEY);
        
        if (isCacheValid(cache) && cache!.data) {
          const data = cache!.data;
          
          // Update account settings
          if (data.accountSettings) {
            setAccountSettings(prev => ({
              ...prev,
              ...data.accountSettings!,
              weddingDate: data.accountSettings!.weddingDate ? new Date(data.accountSettings!.weddingDate) : prev.weddingDate,
            }));
          }

          // Update payment settings
          if (data.paymentSettings) {
            setPaymentSettings(prev => ({
              ...prev,
              ...data.paymentSettings!,
            }));
          }

          // Update notification settings
          if (data.notificationSettings) {
            setNotificationSettings(prev => ({
              ...prev,
              ...data.notificationSettings!,
            }));
          }

          // Update privacy settings
          if (data.privacySettings) {
            setPrivacySettings(prev => ({
              ...prev,
              ...data.privacySettings!,
            }));
          }

          
          setIsLoading(false);
          return;
        }

        // Prevent multiple simultaneous fetches
        if (isFetchingRef.current) {
          return;
        }

        isFetchingRef.current = true;

        const userEmail = auth.user.email
        const userId = auth.user.email
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings/${userId}/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('settings.failedToFetch'));
        }

        const data = await response.json();
        if (data.success && data.settings) {
          // Update cache
          setCache(CACHE_KEY, data.settings);

          // Update account settings
          if (data.settings.accountSettings) {
            setAccountSettings(prev => ({
              ...prev,
              ...data.settings.accountSettings,
              weddingDate: data.settings.accountSettings.weddingDate ? new Date(data.settings.accountSettings.weddingDate) : prev.weddingDate,
            }));
          }

          // Update payment settings
          if (data.settings.paymentSettings) {
            setPaymentSettings(prev => ({
              ...prev,
              ...data.settings.paymentSettings,
            }));
          }

          // Update notification settings
          if (data.settings.notificationSettings) {
            setNotificationSettings(prev => ({
              ...prev,
              ...data.settings.notificationSettings,
            }));
          }

          // Update privacy settings
          if (data.settings.privacySettings) {
            setPrivacySettings(prev => ({
              ...prev,
              ...data.settings.privacySettings,
            }));
          }

        }
      } catch (error) {
        console.error("Error loading settings:", error);
        setSaveError(t('settings.failedToLoad'));
        setTimeout(() => {
          setSaveError(null);
        }, 5000);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    loadSettings();
  }, [auth.user]);

  // Update email when auth is loaded
  useEffect(() => {
    if (auth.user && auth.user.email) {
      setAccountSettings(prev => ({
        ...prev,
        email: auth.user!.email
      }));
    }
  }, [auth.user]);

  // Add this after the other useEffect hooks
  useEffect(() => {
    // Check if we have a Stripe account ID in the settings
    if (paymentSettings.stripeAccountId) {
      setStripeAccountId(paymentSettings.stripeAccountId);
      setStripeConnectStatus('completed');
    }
  }, [paymentSettings.stripeAccountId]);

  const countryCodes = [
    { country: "Sweden", code: "+46", flag: SE },
    { country: "Norway", code: "+47", flag: NO },
    { country: "Denmark", code: "+45", flag: DK },
    { country: "Finland", code: "+358", flag: FI },
    { country: "United Kingdom", code: "+44", flag: GB },
    { country: "United States", code: "+1", flag: US },
    { country: "Germany", code: "+49", flag: DE },
    { country: "France", code: "+33", flag: FR },
  ]

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (setting: string, section: string) => {
    if (section === "notification") {
      setNotificationSettings((prev) => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }))
    } else if (section === "privacy") {
      setPrivacySettings((prev) => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }))
    } else if (section === "payment") {
      setPaymentSettings((prev) => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }))
    }
  }

  const saveAccountSettings = async () => {
    try {
      setIsSaving(prev => ({ ...prev, account: true }));
      setSaveError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
          accountSettings: {
            ...accountSettings,
            weddingDate: accountSettings.weddingDate.toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(t('settings.failedToSaveAccount'));
      }

      clearCache(CACHE_KEY);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving account settings:", error);
      setSaveError(t('settings.failedToSaveAccountError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, account: false }));
    }
  };

  const saveAllSettings = async () => {
    try {
      setIsSaving(prev => ({ ...prev, all: true }));
      setSaveError(null);

      const settingsResponse = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
          accountSettings: {
            ...accountSettings,
            weddingDate: accountSettings.weddingDate.toISOString(),
          },
          paymentSettings: preparePaymentSettingsForSave(),
          notificationSettings,
          privacySettings,
        }),
      });

      if (!settingsResponse.ok) {
        throw new Error(t('settings.failedToSaveAll'));
      }

      clearCache(CACHE_KEY);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving all settings:", error);
      setSaveError(error instanceof Error ? error.message : t('settings.failedToSaveAllError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, all: false }));
    }
  };

  const savePaymentSettings = async () => {
    try {
      setIsSaving(prev => ({ ...prev, payment: true }));
      setSaveError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
          paymentSettings: preparePaymentSettingsForSave(),
        }),
      });

      if (!response.ok) {
        throw new Error(t('settings.failedToSavePayment'));
      }

      clearCache(CACHE_KEY);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving payment settings:", error);
      setSaveError(t('settings.failedToSavePaymentError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, payment: false }));
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setIsSaving(prev => ({ ...prev, notification: true }));
      setSaveError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
          notificationSettings,
        }),
      });

      if (!response.ok) {
        throw new Error(t('settings.failedToSaveNotifications'));
      }

      clearCache(CACHE_KEY);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setSaveError(t('settings.failedToSaveNotificationsError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, notification: false }));
    }
  };

  const savePrivacySettings = async () => {
    try {
      setIsSaving(prev => ({ ...prev, privacy: true }));
      setSaveError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
          privacySettings,
        }),
      });

      if (!response.ok) {
        throw new Error(t('settings.failedToSavePrivacy'));
      }

      clearCache(CACHE_KEY);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      setSaveError(t('settings.failedToSavePrivacyError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, privacy: false }));
    }
  };


  const handleStripeConnect = async () => {
    try {
      setIsSaving(prev => ({ ...prev, payment: true }));
      setSaveError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/settings/stripe-connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          userId: auth.user!.email,
          email: auth.user!.email,
        }),
      });

      if (!response.ok) {
        throw new Error(t('settings.failedToStartStripe'));
      }

      const data = await response.json();
      if (data.success && data.url) {
        setStripeAccountId(data.accountId);
        setStripeConnectStatus('in_progress');
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error starting Stripe Connect:", error);
      setSaveError(t('settings.failedToStartStripeError'));
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(prev => ({ ...prev, payment: false }));
    }
  };

  // Helper function to prepare payment settings for saving
  const preparePaymentSettingsForSave = () => {
    const paymentSettingsToSave: any = {
      paymentMethod: paymentSettings.paymentMethod,
      accountEmail: paymentSettings.accountEmail,
      notifyOnContribution: paymentSettings.notifyOnContribution,
      autoThankYou: paymentSettings.autoThankYou,
    };
    
    // Only include stripeAccountId if payment method is stripe and it has a value
    if (paymentSettings.paymentMethod === 'stripe' && paymentSettings.stripeAccountId) {
      paymentSettingsToSave.stripeAccountId = paymentSettings.stripeAccountId;
    }
    
    // Only include swishPhoneNumber if payment method is swish and it has a value
    if (paymentSettings.paymentMethod === 'swish' && paymentSettings.swishPhoneNumber && paymentSettings.swishPhoneNumber.trim()) {
      paymentSettingsToSave.swishPhoneNumber = paymentSettings.swishPhoneNumber.trim();
    }
    
    // Explicitly exclude fields that don't apply to the selected payment method
    if (paymentSettings.paymentMethod === 'swish') {
      // Remove any Stripe-related fields when Swish is selected
      delete paymentSettingsToSave.stripeAccountId;
    } else if (paymentSettings.paymentMethod === 'stripe') {
      // Remove any Swish-related fields when Stripe is selected
      delete paymentSettingsToSave.swishPhoneNumber;
    }
    
    // Debug logging
    console.log('Original payment settings:', paymentSettings);
    console.log('Prepared payment settings for save:', paymentSettingsToSave);
    
    return paymentSettingsToSave;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <Button 
          onClick={saveAllSettings} 
          className="bg-pink-500 hover:bg-pink-600 min-w-[140px]"
          disabled={isSaving.all || isLoading}
        >
          {isSaving.all ? (
            <>
              <ButtonLoadingSpinner />
              {t('loading.saving')}
            </>
          ) : (
            t('settings.saveAll')
          )}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="account">{t('settings.account')}</TabsTrigger>
            <TabsTrigger value="payment">{t('settings.payment')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('settings.privacy')}</TabsTrigger>
        </TabsList>

        <div className="relative">
          {isLoading && <OverlayLoading text={t('loading.settings')} />}

          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            {/* Account Settings */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.accountSettings')}</CardTitle>
                  <CardDescription>{t('settings.personalInfo')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('settings.personalInfo')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('form.name')}</Label>
                        <Input id="name" name="name" value={accountSettings.name} onChange={handleAccountChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('form.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={accountSettings.email}
                          onChange={handleAccountChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500">{t('settings.emailCannotBeChanged')}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="partner1Name">{t('settings.partner1Name')}</Label>
                        <Input 
                          id="partner1Name" 
                          name="partner1Name" 
                          value={accountSettings.partner1Name} 
                          onChange={handleAccountChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partner2Name">{t('settings.partner2Name')}</Label>
                        <Input 
                          id="partner2Name" 
                          name="partner2Name" 
                          value={accountSettings.partner2Name} 
                          onChange={handleAccountChange} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weddingDate">{t('settings.weddingDate')}</Label>
                      <DatePicker 
                        date={accountSettings.weddingDate} 
                        setDate={(date) => {
                          if (date) {
                            setAccountSettings(prev => ({
                              ...prev,
                              weddingDate: date
                            }))
                          }
                        }} 
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium">{t('settings.shippingAddress')}</h4>
                      <div className="space-y-2">
                        <Label htmlFor="street">{t('settings.street')}</Label>
                        <Input 
                          id="street" 
                          name="shippingAddress.street" 
                          value={accountSettings.shippingAddress.street} 
                          onChange={(e) => setAccountSettings(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                          }))} 
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">{t('settings.city')}</Label>
                          <Input 
                            id="city" 
                            name="shippingAddress.city" 
                            value={accountSettings.shippingAddress.city} 
                            onChange={(e) => setAccountSettings(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                            }))} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">{t('settings.state')}</Label>
                          <Input 
                            id="state" 
                            name="shippingAddress.state" 
                            value={accountSettings.shippingAddress.state} 
                            onChange={(e) => setAccountSettings(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                            }))} 
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">{t('settings.zipCode')}</Label>
                          <Input 
                            id="zipCode" 
                            name="shippingAddress.zipCode" 
                            value={accountSettings.shippingAddress.zipCode} 
                            onChange={(e) => setAccountSettings(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, zipCode: e.target.value }
                            }))} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">{t('settings.country')}</Label>
                          <div className="relative">
                            <Input 
                              id="country" 
                              name="shippingAddress.country" 
                              value={accountSettings.shippingAddress.country}
                              onChange={(e) => {
                                setCountrySearch(e.target.value);
                                setAccountSettings(prev => ({
                                  ...prev,
                                  shippingAddress: { ...prev.shippingAddress, country: e.target.value }
                                }));
                              }}
                              placeholder="Search country..."
                            />
                            {countrySearch && (
                              <div className="absolute top-full left-0 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-y-auto z-10">
                                {countryCodes
                                  .filter(country => 
                                    country.country.toLowerCase().includes(countrySearch.toLowerCase())
                                  )
                                  .map((country) => (
                                    <div
                                      key={country.code}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
                                      onClick={() => {
                                        setAccountSettings(prev => ({
                                          ...prev,
                                          shippingAddress: { ...prev.shippingAddress, country: country.country }
                                        }));
                                        setCountrySearch("");
                                      }}
                                    >
                                      {React.createElement(country.flag, {
                                        className: "w-4 h-4"
                                      })}
                                      <span>{country.country}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t('settings.phoneNumber')}</Label>
                      <div className="flex gap-2">
                        <Select
                          value={accountSettings.phoneNumber.countryCode}
                          onValueChange={(value) => setAccountSettings(prev => ({
                            ...prev,
                            phoneNumber: { ...prev.phoneNumber, countryCode: value }
                          }))}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={t('settings.selectCountry')}>
                              {accountSettings.phoneNumber.countryCode && (
                                <div className="flex items-center gap-2">
                                  {countryCodes.find(c => c.code === accountSettings.phoneNumber.countryCode)?.flag && 
                                    React.createElement(countryCodes.find(c => c.code === accountSettings.phoneNumber.countryCode)!.flag, {
                                      className: "w-4 h-4"
                                    })
                                  }
                                  <span>{accountSettings.phoneNumber.countryCode}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  {React.createElement(country.flag, {
                                    className: "w-4 h-4"
                                  })}
                                  <span>{country.country} ({country.code})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          id="phoneNumber" 
                          name="phoneNumber" 
                          type="tel" 
                          value={accountSettings.phoneNumber.number}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setAccountSettings(prev => ({
                              ...prev,
                              phoneNumber: { ...prev.phoneNumber, number: value }
                            }))
                          }}
                          placeholder={t('settings.phoneNumber')}
                          className="w-[200px]"
                          pattern="[0-9]*"
                          inputMode="numeric"
                        />
                      </div>
                      <p className="text-xs text-gray-500">{t('settings.forShipping')}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={saveAccountSettings}
                    disabled={isSaving.account}
                    className="min-w-[120px]"
                  >
                    {isSaving.account ? (
                      <>
                        <ButtonLoadingSpinner />
                        {t('loading.saving')}
                      </>
                    ) : (
                      t('settings.saveAccount')
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.payment')}</CardTitle>
                  <CardDescription>{t('settings.paymentMethod')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('settings.paymentMethod')}</h3>
                    <RadioGroup 
                      value={paymentSettings.paymentMethod} 
                      onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, paymentMethod: value }))}
                      className="grid gap-2"
                    >
                      {/* Stripe option hidden for first release */}
                      {/* <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe">{t('payment.stripe')}</Label>
                      </div> */}
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="swish" id="swish" />
                        <Label htmlFor="swish">{t('settings.swishPrivatePhone')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Stripe configuration hidden for first release */}
                  {/* {paymentSettings.paymentMethod === 'stripe' && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">{t('settings.stripeConnectAccount')}</h4>
                            <p className="text-sm text-gray-500">
                              {stripeConnectStatus === 'not_started' && t('settings.setupStripeAccount')}
                              {stripeConnectStatus === 'in_progress' && t('settings.completeStripeSetup')}
                              {stripeConnectStatus === 'completed' && t('settings.stripeAccountReady')}
                            </p>
                          </div>
                          {stripeConnectStatus !== 'completed' && (
                            <Button
                              onClick={handleStripeConnect}
                              disabled={isSaving.payment}
                              className="bg-pink-500 hover:bg-pink-600"
                            >
                              {isSaving.payment ? (
                                <>
                                  <ButtonLoadingSpinner />
                                  {t('loading.settingUp')}
                                </>
                              ) : (
                                t('settings.setupStripeButton')
                              )}
                            </Button>
                          )}
                        </div>
                        {stripeConnectStatus === 'completed' && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                            <Check className="h-4 w-4" />
                            <span>{t('settings.stripeAccountConnected')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )} */}

                  {paymentSettings.paymentMethod === 'swish' && (
                    <div className="space-y-2">
                      <Label htmlFor="swishPhoneNumber">{t('settings.swishPhoneNumber')}</Label>
                      <Input
                        id="swishPhoneNumber"
                        type="tel"
                        placeholder="e.g. 0701234567"
                        value={paymentSettings.swishPhoneNumber}
                        onChange={e => setPaymentSettings(prev => ({ ...prev, swishPhoneNumber: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">{t('settings.enterPrivateSwishNumber')}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="accountEmail">{t('settings.accountEmail')}</Label>
                    <Input
                      id="accountEmail"
                      value={paymentSettings.accountEmail}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, accountEmail: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500">{t('settings.emailAssociatedWithPayment')}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('settings.contributionSettings')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifyOnContribution">{t('settings.notifyOnContribution')}</Label>
                          <p className="text-xs text-gray-500">{t('settings.receiveEmailOnContribution')}</p>
                        </div>
                        <Switch
                          id="notifyOnContribution"
                          checked={paymentSettings.notifyOnContribution}
                          onCheckedChange={() => handleSwitchChange("notifyOnContribution", "payment")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoThankYou">{t('settings.automaticThankYouEmails')}</Label>
                          <p className="text-xs text-gray-500">{t('settings.sendAutomaticThankYou')}</p>
                        </div>
                        <Switch
                          id="autoThankYou"
                          checked={paymentSettings.autoThankYou}
                          onCheckedChange={() => handleSwitchChange("autoThankYou", "payment")}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={savePaymentSettings}
                    disabled={isSaving.payment}
                    className="min-w-[140px]"
                  >
                    {isSaving.payment ? (
                      <>
                        <ButtonLoadingSpinner />
                        {t('loading.saving')}
                      </>
                    ) : (
                      t('settings.savePayment')
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.notifications')}</CardTitle>
                  <CardDescription>{t('settings.emailNotifications')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">{t('settings.emailNotifications')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.receiveEmailNotifications')}</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleSwitchChange("emailNotifications", "notification")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="contributionAlerts">{t('settings.contributionAlerts')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.getNotifiedOnContribution')}</p>
                      </div>
                      <Switch
                        id="contributionAlerts"
                        checked={notificationSettings.contributionAlerts}
                        onCheckedChange={() => handleSwitchChange("contributionAlerts", "notification")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyDigest">{t('settings.weeklyDigest')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.receiveWeeklySummary')}</p>
                      </div>
                      <Switch
                        id="weeklyDigest"
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={() => handleSwitchChange("weeklyDigest", "notification")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">{t('settings.marketingEmails')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.receiveMarketingUpdates')}</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={() => handleSwitchChange("marketingEmails", "notification")}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={saveNotificationSettings}
                    disabled={isSaving.notification}
                    className="min-w-[160px]"
                  >
                    {isSaving.notification ? (
                      <>
                        <ButtonLoadingSpinner />
                        {t('loading.saving')}
                      </>
                    ) : (
                      t('settings.saveNotifications')
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.privacy')}</CardTitle>
                  <CardDescription>{t('settings.showContributorNames')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showContributorNames">{t('settings.showContributorNames')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.displayContributorNames')}</p>
                      </div>
                      <Switch
                        id="showContributorNames"
                        checked={privacySettings.showContributorNames}
                        onCheckedChange={() => handleSwitchChange("showContributorNames", "privacy")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showContributionAmounts">{t('settings.showContributionAmounts')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.displayContributionAmounts')}</p>
                      </div>
                      <Switch
                        id="showContributionAmounts"
                        checked={privacySettings.showContributionAmounts}
                        onCheckedChange={() => handleSwitchChange("showContributionAmounts", "privacy")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowGuestComments">{t('settings.allowGuestComments')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.letGuestsLeaveComments')}</p>
                      </div>
                      <Switch
                        id="allowGuestComments"
                        checked={privacySettings.allowGuestComments}
                        onCheckedChange={() => handleSwitchChange("allowGuestComments", "privacy")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showRegistry">{t('settings.showRegistry')}</Label>
                        <p className="text-xs text-gray-500">{t('settings.makeRegistryVisible')}</p>
                      </div>
                      <Switch
                        id="showRegistry"
                        checked={privacySettings.showRegistry}
                        onCheckedChange={() => handleSwitchChange("showRegistry", "privacy")}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={savePrivacySettings}
                    disabled={isSaving.privacy}
                    className="min-w-[140px]"
                  >
                    {isSaving.privacy ? (
                      <>
                        <ButtonLoadingSpinner />
                        {t('loading.saving')}
                      </>
                    ) : (
                      t('settings.savePrivacy')
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </div>
        </div>
      </Tabs>
    </div>
  )
}
