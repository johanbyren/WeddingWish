"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Check } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Switch } from "../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"

export default function Settings() {
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: "John & Jane Doe",
    email: "johnjane@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

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
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={accountSettings.currentPassword}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>
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
