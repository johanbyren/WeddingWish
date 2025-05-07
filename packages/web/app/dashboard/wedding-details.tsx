"use client"

import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { WeddingType } from "@wedding-wish/core/wedding"
import { useAuth } from "~/context/auth"

export default function WeddingDetails() {
  const auth = useAuth()
  const [weddings, setWeddings] = useState<WeddingType[]>([])
  const [loading, setLoading] = useState(true)

  const handleDeleteWedding = async (weddingId: string) => {
    if (!confirm('Are you sure you want to delete this wedding page? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({ 
          weddingId,
          userId: auth.user?.email 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete wedding');
      }

      setWeddings([]);
    } catch (error) {
      console.error("Error deleting wedding:", error);
      alert('Failed to delete wedding. Please try again.');
    }
  };

  useEffect(() => {
    const fetchWeddings = async () => {
      // Wait for auth to be ready
      if (!auth.user?.email) {
        return;
      }

      try {
        console.log('fetchWeddings: ', auth)
        const userEmail = auth.user.email
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await auth.getToken()}`,
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch weddings');
        }
  
        const data = await response.json();
        console.log('Weddings fetched:', data);
        setWeddings(data)
      } catch (error) {
        console.error("Error fetching weddings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeddings()
  }, [auth.user?.email]) // Add auth.user?.email as dependency

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {weddings.length === 0 && (
          <Button asChild className="bg-pink-500 hover:bg-pink-600">
            <Link to="/dashboard/create" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Create Wedding Page</span>
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="wedding-details">
        <TabsList>
          <TabsTrigger value="wedding-details">Wedding Details</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding-details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Wedding Page</CardTitle>
              <CardDescription>Manage your wedding page details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : weddings.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>{weddings[0].title || "Untitled Wedding"}</CardTitle>
                      <CardDescription>
                        Created on {new Date(weddings[0].createdAt || "").toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {weddings[0].date && (
                        <p className="text-sm">Wedding Date: {new Date(weddings[0].date).toLocaleDateString()}</p>
                      )}
                      {weddings[0].location && <p className="text-sm">Location: {weddings[0].location}</p>}
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/${weddings[0].weddingId}`}>View Page</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteWedding(weddings[0].weddingId)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="border-dashed border-2">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">No Wedding Page Yet</CardTitle>
                      <CardDescription className="mt-2">
                        Create your wedding page to get started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          Start by creating your wedding page to share with your guests
                        </p>
                        <Button asChild>
                          <Link to="/dashboard/create" className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Create Wedding Page</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 