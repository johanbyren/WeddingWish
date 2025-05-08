"use client"

import React from "react"
import { useState } from "react"
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
//import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "~/components/ui/command"

export default function Settings() {
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: "John & Jane Doe",
    email: "johnjane@example.com",
    partner1Name: "John Doe",
    partner2Name: "Jane Doe",
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

  // Wedding page settings
  const [pageSettings, setPageSettings] = useState({
    visibility: "public",
    customUrl: "john-and-jane",
    theme: "classic",
    primaryColor: "pink",
  })

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethod: "stripe",
    accountEmail: "johnjane@example.com",
    notifyOnContribution: true,
    autoThankYou: true,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contributionAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showContributorNames: true,
    showContributionAmounts: false,
    allowGuestComments: true,
    showRegistry: true,
  })

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

  const saveSettings = () => {
    // In a real app, you would save the settings to a database
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={saveSettings} className="bg-pink-500 hover:bg-pink-600">
          Save All Settings
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="wedding-page">Wedding Page</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={accountSettings.name} onChange={handleAccountChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={accountSettings.email}
                      onChange={handleAccountChange}
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email address cannot be changed as it is used as your account identifier</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="partner1Name">First Partner</Label>
                    <Input 
                      id="partner1Name" 
                      name="partner1Name" 
                      value={accountSettings.partner1Name} 
                      onChange={handleAccountChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner2Name">Second Partner</Label>
                    <Input 
                      id="partner2Name" 
                      name="partner2Name" 
                      value={accountSettings.partner2Name} 
                      onChange={handleAccountChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingDate">Wedding Date</Label>
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
                  <h4 className="text-md font-medium">Shipping Address</h4>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
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
                      <Label htmlFor="city">City</Label>
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
                      <Label htmlFor="state">State</Label>
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
                      <Label htmlFor="zipCode">ZIP Code</Label>
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
                      <Label htmlFor="country">Country</Label>
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
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select
                      value={accountSettings.phoneNumber.countryCode}
                      onValueChange={(value) => setAccountSettings(prev => ({
                        ...prev,
                        phoneNumber: { ...prev.phoneNumber, countryCode: value }
                      }))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select country">
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
                      placeholder="Phone number"
                      className="w-[200px]"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  <p className="text-xs text-gray-500">For shipping notifications and important updates</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Wedding Page Settings */}
        <TabsContent value="wedding-page">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Page Settings</CardTitle>
              <CardDescription>Customize how your wedding page appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Page Visibility</h3>
                <RadioGroup defaultValue={pageSettings.visibility} className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public - Anyone with the link can view</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="password" id="password" />
                    <Label htmlFor="password">Password Protected - Guests need a password</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private - Only you can view</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customUrl">Custom URL</Label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">weddingwish.com/wedding/</span>
                  <Input
                    id="customUrl"
                    value={pageSettings.customUrl}
                    className="max-w-[200px]"
                    onChange={(e) => setPageSettings((prev) => ({ ...prev, customUrl: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-gray-500">Choose a unique URL for your wedding page</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Page Theme</Label>
                  <Select
                    defaultValue={pageSettings.theme}
                    onValueChange={(value: "classic" | "modern" | "rustic" | "elegant" | "minimalist") => 
                      setPageSettings((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="rustic">Rustic</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Select
                    defaultValue={pageSettings.primaryColor}
                    onValueChange={(value: "pink" | "blue" | "green" | "purple" | "gold") => 
                      setPageSettings((prev) => ({ ...prev, primaryColor: value }))
                    }
                  >
                    <SelectTrigger id="primaryColor">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Page Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage how you receive contributions from guests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <RadioGroup defaultValue={paymentSettings.paymentMethod} className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe">Stripe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountEmail">Payment Account Email</Label>
                <Input
                  id="accountEmail"
                  value={paymentSettings.accountEmail}
                  onChange={(e) => setPaymentSettings((prev) => ({ ...prev, accountEmail: e.target.value }))}
                />
                <p className="text-xs text-gray-500">Email associated with your payment account</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contribution Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnContribution">Notify on contribution</Label>
                      <p className="text-xs text-gray-500">Receive an email when someone contributes</p>
                    </div>
                    <Switch
                      id="notifyOnContribution"
                      checked={paymentSettings.notifyOnContribution}
                      onCheckedChange={() => handleSwitchChange("notifyOnContribution", "payment")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoThankYou">Automatic thank you emails</Label>
                      <p className="text-xs text-gray-500">Send automatic thank you emails to contributors</p>
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
              <Button>Update Payment Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleSwitchChange("emailNotifications", "notification")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="contributionAlerts">Contribution Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified when someone contributes to your registry</p>
                  </div>
                  <Switch
                    id="contributionAlerts"
                    checked={notificationSettings.contributionAlerts}
                    onCheckedChange={() => handleSwitchChange("contributionAlerts", "notification")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                    <p className="text-xs text-gray-500">Receive a weekly summary of activity</p>
                  </div>
                  <Switch
                    id="weeklyDigest"
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={() => handleSwitchChange("weeklyDigest", "notification")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-xs text-gray-500">Receive updates and offers from WeddingWish</p>
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
              <Button>Update Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control what information is visible to your guests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showContributorNames">Show Contributor Names</Label>
                    <p className="text-xs text-gray-500">Display the names of people who contribute to your registry</p>
                  </div>
                  <Switch
                    id="showContributorNames"
                    checked={privacySettings.showContributorNames}
                    onCheckedChange={() => handleSwitchChange("showContributorNames", "privacy")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showContributionAmounts">Show Contribution Amounts</Label>
                    <p className="text-xs text-gray-500">Display how much each person contributed</p>
                  </div>
                  <Switch
                    id="showContributionAmounts"
                    checked={privacySettings.showContributionAmounts}
                    onCheckedChange={() => handleSwitchChange("showContributionAmounts", "privacy")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowGuestComments">Allow Guest Comments</Label>
                    <p className="text-xs text-gray-500">Let guests leave comments on your wedding page</p>
                  </div>
                  <Switch
                    id="allowGuestComments"
                    checked={privacySettings.allowGuestComments}
                    onCheckedChange={() => handleSwitchChange("allowGuestComments", "privacy")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showRegistry">Show Registry</Label>
                    <p className="text-xs text-gray-500">Make your gift registry visible to guests</p>
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
              <Button>Update Privacy Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
