"use client"

import { Link } from "react-router-dom"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import type { WeddingType } from "@wedding-wish/core/wedding"
import { useAuth } from "~/context/auth"
import { getCache, setCache, clearCache, isCacheValid } from "~/utils/cache"

const CACHE_KEY = 'wedding_details_cache';

export default function WeddingDetails() {
  const auth = useAuth()
  const [weddings, setWeddings] = useState<WeddingType[]>([])
  const [loading, setLoading] = useState(true)
  const isFetchingRef = useRef(false);

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

      clearCache(CACHE_KEY);
      setWeddings([]);
    } catch (error) {
      console.error("Error deleting wedding:", error);
      alert('Failed to delete wedding. Please try again.');
    }
  };

  const fetchWeddings = useCallback(async () => {
    // Wait for auth to be ready
    if (!auth.user?.email) {
      return;
    }

    // Check cache first
    const cache = getCache<WeddingType[]>(CACHE_KEY);
    
    if (isCacheValid(cache) && cache!.data) {
      setWeddings(cache!.data);
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;      
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
      
      // Update cache with new data
      setCache(CACHE_KEY, data);
      setWeddings(data);
    } catch (error) {
      console.error("Error fetching weddings:", error)
    } finally {
      setLoading(false)
      isFetchingRef.current = false;
    }
  }, [auth.user?.email, auth.getToken]);

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

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
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                  <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-pink-500 font-medium">Loading wedding details...</p>
                </div>
              </div>
            )}
            <div className={loading ? "opacity-50 pointer-events-none" : ""}>
              <Card>
                <CardHeader>
                  <CardTitle>Your Wedding Page</CardTitle>
                  <CardDescription>Manage your wedding page details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {!loading && (weddings.length > 0 ? (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 