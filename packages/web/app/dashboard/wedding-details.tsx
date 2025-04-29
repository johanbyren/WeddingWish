"use client"

import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { GiftRegistry } from "~/components/gift-registry"

export default function WeddingDetails() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild className="bg-pink-500 hover:bg-pink-600">
          <Link to="/dashboard/create" className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Create New Wedding Page</span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="wedding-details">
        <TabsList>
          <TabsTrigger value="wedding-details">Wedding Details</TabsTrigger>
          <TabsTrigger value="gift-registry">Gift Registry</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding-details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Wedding Pages</CardTitle>
              <CardDescription>Manage your existing wedding pages or create a new one.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>John & Jane's Wedding</CardTitle>
                    <CardDescription>Created on April 15, 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">Wedding Date: June 15, 2024</p>
                    <p className="text-sm">Location: Sunset Beach Resort, Miami, FL</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/wedding/123">View Page</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/dashboard/create" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Create New Wedding Page</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="gift-registry" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gift Registry</CardTitle>
              <CardDescription>Manage your gift registry items.</CardDescription>
            </CardHeader>
            <CardContent>
              <GiftRegistry />
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/dashboard/gifts">Manage All Gifts</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 