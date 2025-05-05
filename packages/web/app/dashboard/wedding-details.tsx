"use client"

import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { GiftRegistry } from "~/components/gift-registry"
import { useEffect, useState } from "react"
import type { WeddingType } from "@wedding-wish/core/wedding"
import { useAuth } from "~/context/auth"

export default function WeddingDetails() {
  const auth = useAuth()
  const [weddings, setWeddings] = useState<WeddingType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeddings = async () => {

      try {
        console.log('fetchWeddings: ', auth)
        const userEmail = auth.user?.email
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await auth.getToken()}`,
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to create wedding');
        }
  
        const data = await response.json();
        console.log('Wedding created:', data);
        setWeddings(data)
      } catch (error) {
        console.error("Error fetching weddings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeddings()
  }, [])

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
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : weddings.length > 0 ? (
                  weddings.map((wedding) => (
                    <Card key={wedding.weddingId}>
                      <CardHeader className="pb-2">
                        <CardTitle>{wedding.title || "Untitled Wedding"}</CardTitle>
                        <CardDescription>
                          Created on {new Date(wedding.createdAt || "").toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {wedding.date && (
                          <p className="text-sm">Wedding Date: {new Date(wedding.date).toLocaleDateString()}</p>
                        )}
                        {wedding.location && <p className="text-sm">Location: {wedding.location}</p>}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/${wedding.weddingId}`}>View Page</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed border-2">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">No Wedding Pages Yet</CardTitle>
                      <CardDescription className="mt-2">
                        Create your first wedding page to get started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          Start by creating a beautiful wedding page to share with your guests
                        </p>
                        <Button asChild>
                          <Link to="/dashboard/create" className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Create Your First Wedding Page</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
            {weddings.length > 0 && (
              <CardFooter>
                <Button asChild>
                  <Link to="/dashboard/create" className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span>Create New Wedding Page</span>
                  </Link>
                </Button>
              </CardFooter>
            )}
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