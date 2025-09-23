"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { HeartIcon, ArrowLeft, ImagePlus, Plus, Trash2, Check } from "lucide-react"
import { DatePicker } from "../../components/date-picker"
import { ImageUploader } from "../../components/image-uploader"
import { CoverImageUploader } from "../../components/cover-image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { useAuth } from "~/context/auth"
import { LanguageSelector, useTranslation } from "~/context/translation"
import { v4 as uuidv4 } from 'uuid'
import { clearCache } from "~/utils/cache"
import { getThemeConfig, getThemeStyles } from "~/utils/themes"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { LocationAutocomplete } from "../../components/location-autocomplete"
import WeddingPreview from "../../components/wedding-preview"

export default function CreateWeddingPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const weddingId = searchParams.get('weddingId');
  const isEditMode = !!weddingId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState("details");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [weddingDetails, setWeddingDetails] = useState({
    title: "",
    date: new Date(),
    time: "14:00",
    location: "",
    story: "",
    coverPhoto: null as File | null,
    coverPhotoPreview: "",
    additionalPhotos: [] as { file: File; preview: string }[],
    giftItems: [] as {
      id: string;
      giftId?: string; // Add giftId for existing gifts
      name: string;
      description: string;
      price: string;
      imageFile: File | null;
      imagePreview: string;
    }[],
    theme: "default",
    primaryColor: "#FF5733",
    visibility: "public",
    password: "",
    customUrl: "",
    language: "en" as "en" | "sv"
  });

  const [newGiftItem, setNewGiftItem] = useState({
    id: "",
    giftId: undefined as string | undefined,
    name: "",
    description: "",
    price: "",
    imageFile: null as File | null,
    imagePreview: "",
  })

  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
  }>({
    isValid: true,
    message: "",
    isChecking: false,
  });

  const [userWeddings, setUserWeddings] = useState<Array<{ weddingId: string; customUrl?: string }>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWeddingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setWeddingDetails((prev) => ({ ...prev, date }))
    }
  }

  const handleCoverPhotoChange = (file: File) => {
    const preview = URL.createObjectURL(file)
    setWeddingDetails((prev) => ({
      ...prev,
      coverPhoto: file,
      coverPhotoPreview: preview,
    }))
  }

  const handleAdditionalPhotoAdd = (file: File) => {
    console.log('handleAdditionalPhotoAdd called with file:', file.name, file.size);
    
    // Create a unique identifier for this file
    const fileId = `${file.name}-${file.size}-${file.lastModified}`;
    
    // Use a more robust duplicate check that includes the preview URL
    setWeddingDetails((prev) => {
      console.log('Current additionalPhotos count:', prev.additionalPhotos.length);
      console.log('Current additionalPhotos:', prev.additionalPhotos.map(p => ({ name: p.file?.name, size: p.file?.size, preview: p.preview?.substring(0, 50) })));
      
      // Check if this exact file is already in the array to prevent duplicates
      const isDuplicate = prev.additionalPhotos.some(photo => 
        photo.file && 
        photo.file.name === file.name && 
        photo.file.size === file.size &&
        photo.file.lastModified === file.lastModified
      );
      
      if (isDuplicate) {
        console.warn('Duplicate photo detected, skipping add');
        return prev;
      }
      
      const preview = URL.createObjectURL(file);
      const newPhotos = [...prev.additionalPhotos, { file, preview }];
      console.log('Adding new photo, new count:', newPhotos.length);
      
      return {
        ...prev,
        additionalPhotos: newPhotos,
      };
    })
  }

  const removeCoverPhoto = () => {
    if (confirm(t('create.confirmRemoveCoverPhoto'))) {
      setWeddingDetails((prev) => ({
        ...prev,
        coverPhoto: null,
        coverPhotoPreview: "",
      }))
    }
  }

  const removeAdditionalPhoto = (index: number) => {
    if (confirm(t('create.confirmRemovePhoto'))) {
      setWeddingDetails((prev) => {
        const photoToRemove = prev.additionalPhotos[index];
        // Clean up the object URL if it exists
        if (photoToRemove?.preview && photoToRemove.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photoToRemove.preview);
        }
        return {
          ...prev,
          additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
        };
      })
    }
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all blob URLs when component unmounts
      weddingDetails.additionalPhotos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
      if (weddingDetails.coverPhotoPreview && weddingDetails.coverPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(weddingDetails.coverPhotoPreview);
      }
    };
  }, []);

  const handleGiftImageSelected = (file: File) => {
    const preview = URL.createObjectURL(file)
    setNewGiftItem((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
    }))
  }

  const handleNewGiftItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewGiftItem((prev) => ({ ...prev, [name]: value }))
  }

  const addGiftItem = () => {
    if (newGiftItem.name && newGiftItem.price) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setWeddingDetails((prev) => ({
        ...prev,
        giftItems: [...prev.giftItems, { ...newGiftItem, id }],
      }))
      setNewGiftItem({
        id: "",
        giftId: undefined,
        name: "",
        description: "",
        price: "",
        imageFile: null,
        imagePreview: "",
      })
    }
  }

  const removeGiftItem = (id: string) => {
    setWeddingDetails((prev) => ({
      ...prev,
      giftItems: prev.giftItems.filter((item) => item.id !== id),
    }))
  }

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      if (!isEditMode || !weddingId) return;

      try {
        setIsLoading(true);
        // Fetch wedding details with cache-busting parameter to ensure fresh data
        const cacheBuster = Date.now();
        const weddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/id/${weddingId}?t=${cacheBuster}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!weddingResponse.ok) {
          throw new Error('Failed to fetch wedding details');
        }

        const weddingData = await weddingResponse.json();
        console.log('Loaded wedding data for editing:', weddingData);
        
        // Fetch photos
        const photosResponse = await fetch(`${import.meta.env.VITE_API_URL}api/photo/wedding/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!photosResponse.ok) {
          throw new Error('Failed to fetch photos');
        }

        const photosData = await photosResponse.json();
        
        // Fetch gifts if they exist
        const giftsResponse = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/wedding/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (giftsResponse.ok) {
          const giftsData = await giftsResponse.json();
          
          // Get signed URLs for gift images
          const giftsWithUrls = await Promise.all(
            giftsData.map(async (gift: any) => {
              let imagePreview = "";
              if (gift.imageUrl) {
                try {
                  imagePreview = await getGiftImageUrl(gift.imageUrl);
                } catch (error) {
                  console.error('Error getting gift image URL:', error);
                }
              }
              return {
                ...gift,
                id: gift.giftId || gift.id, // Ensure we have an id field
                imagePreview
              };
            })
          );

          setWeddingDetails(prev => ({
            ...prev,
            title: weddingData.title || "",
            date: weddingData.date ? new Date(weddingData.date.split('T')[0]) : new Date(),
            time: weddingData.time || "14:00",
            location: weddingData.location || "",
            story: weddingData.story || "",
            coverPhotoPreview: photosData.find((photo: { key: string }) => photo.key.includes('cover-'))?.url || "",
            additionalPhotos: photosData
              .filter((photo: { key: string }) => photo.key.includes('gallery-'))
              .map((photo: { key: string; url: string }) => ({
                file: null as File | null,
                preview: photo.url,
              })),
            customUrl: weddingData.customUrl || "",
            visibility: weddingData.visibility || "public",
            password: weddingData.password || "",
            theme: weddingData.theme || "default",
            primaryColor: weddingData.primaryColor || "#FF5733",
            language: weddingData.language || "en",
            giftItems: giftsWithUrls
          }));
        } else {
          setWeddingDetails(prev => ({
            ...prev,
            title: weddingData.title || "",
            date: weddingData.date ? new Date(weddingData.date.split('T')[0]) : new Date(),
            time: weddingData.time || "14:00",
            location: weddingData.location || "",
            story: weddingData.story || "",
            coverPhotoPreview: photosData.find((photo: { key: string }) => photo.key.includes('cover-'))?.url || "",
            additionalPhotos: photosData
              .filter((photo: { key: string }) => photo.key.includes('gallery-'))
              .map((photo: { key: string; url: string }) => ({
                file: null as File | null,
                preview: photo.url,
              })),
            customUrl: weddingData.customUrl || "",
            visibility: weddingData.visibility || "public",
            password: weddingData.password || "",
            theme: weddingData.theme || "default",
            primaryColor: weddingData.primaryColor || "#FF5733",
            language: weddingData.language || "en",
          }));
        }
      } catch (error) {
        console.error('Error fetching wedding details:', error);
        alert('Failed to load wedding details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeddingDetails();
  }, [isEditMode, weddingId]);

  // Load user's weddings when component mounts
  useEffect(() => {
    const loadUserWeddings = async () => {
      if (!auth.user?.email) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/${auth.user.email}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user's weddings");
        }

        const data = await response.json();
        setUserWeddings(data);
      } catch (error) {
        console.error("Error loading user's weddings:", error);
      }
    };

    loadUserWeddings();
  }, [auth.user]);

  // Add debounced URL validation
  useEffect(() => {
    const checkUrlUniqueness = async () => {
      if (!weddingDetails.customUrl) {
        setUrlValidation({
          isValid: true,
          message: "",
          isChecking: false,
        });
        return;
      }

      setUrlValidation(prev => ({ ...prev, isChecking: true }));
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/show-wedding/custom-url/${weddingDetails.customUrl}`, {
          method: 'GET'
        });
        const exists = response.status === 200;
        
        // Check if the URL belongs to one of the user's weddings
        const isUserWedding = userWeddings.some(wedding => wedding.customUrl === weddingDetails.customUrl);
        
        setUrlValidation({
          isValid: !exists || isUserWedding,
          message: exists && !isUserWedding ? t('create.urlTaken') : t('create.urlAvailable'),
          isChecking: false,
        });
      } catch (error) {
        setUrlValidation({
          isValid: false,
          message: t('create.urlCheckError'),
          isChecking: false,
        });
      }
    };

    const timeoutId = setTimeout(checkUrlUniqueness, 500);
    return () => clearTimeout(timeoutId);
  }, [weddingDetails.customUrl, userWeddings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const weddingId = searchParams.get('weddingId') || uuidv4();
      const photoUrls: string[] = [];

      // Process wedding photos
      if (isEditMode) {
        // 1. Get current wedding data and photos
        const currentWeddingResponse = await fetch(`${import.meta.env.VITE_API_URL}api/wedding/id/${weddingId}`, {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        });

        if (!currentWeddingResponse.ok) {
          throw new Error('Failed to fetch current wedding data');
        }

        const currentWedding = await currentWeddingResponse.json();
        const currentPhotoUrls: string[] = (currentWedding.photoUrls || []).map((url: string) => 
          url.startsWith('weddings/') ? url : `weddings/${weddingId}/${url}`
        );

        // 2. Process new photos (both cover and gallery)
        const newPhotoUrls = await processNewPhotos(weddingId);
        console.log('New photo URLs:', newPhotoUrls);
        photoUrls.push(...newPhotoUrls);

        // 3. Get existing photos that should be kept
        const existingPhotoUrls = weddingDetails.additionalPhotos
          .filter(photo => !photo.file)
          .map(photo => {
            const urlParts = photo.preview.split('/');
            const keyWithParams = urlParts[urlParts.length - 1];
            const fileName = keyWithParams.split('?')[0];
            return `weddings/${weddingId}/${fileName}`;
          });

        console.log('Existing photo URLs:', existingPhotoUrls);

        // Add cover photo if it exists and hasn't been changed
        if (weddingDetails.coverPhotoPreview && !weddingDetails.coverPhoto) {
          const coverPhotoUrl = currentPhotoUrls.find(url => url.includes('cover-'));
          if (coverPhotoUrl) {
            existingPhotoUrls.push(coverPhotoUrl);
            console.log('Added existing cover photo:', coverPhotoUrl);
          }
        }

        // 4. Find and delete removed photos
        const photosToDelete = currentPhotoUrls.filter(url => 
          ![...newPhotoUrls, ...existingPhotoUrls].includes(url)
        );

        console.log('Photos to delete:', photosToDelete);
        await deletePhotos(photosToDelete);

        // 5. Add existing photos that should be kept
        photoUrls.push(...existingPhotoUrls);
        console.log('Final photo URLs:', photoUrls);
      } else {
        const newPhotoUrls = await processNewPhotos(weddingId);
        photoUrls.push(...newPhotoUrls);
      }

      // Process gift photos and create gifts
      const giftResults = await processGifts(weddingId);

      // Update wedding with all photos and gift data
      await updateWedding(weddingId, photoUrls, giftResults);

      // Clear user-specific dashboard cache so it shows updated data
      clearCache(`wedding_details_cache_${auth.user?.email}`);

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} wedding:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} wedding. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to process new photos (both cover and gallery)
  const processNewPhotos = async (weddingId: string): Promise<string[]> => {
    const photoUrls: string[] = [];

    // Process cover photo
    if (weddingDetails.coverPhoto) {
      const coverPhotoUrl = await uploadPhoto(
        weddingId,
        weddingDetails.coverPhoto,
        `cover-${weddingDetails.coverPhoto.name}`
      );
      photoUrls.push(coverPhotoUrl);
    }

    // Process gallery photos
    for (const photo of weddingDetails.additionalPhotos) {
      if (!photo.file) continue;

      const galleryPhotoUrl = await uploadPhoto(
        weddingId,
        photo.file,
        `gallery-${photo.file.name}`
      );
      photoUrls.push(galleryPhotoUrl);
    }

    return photoUrls;
  };

  // Helper function to upload a single photo
  const uploadPhoto = async (weddingId: string, file: File, fileName: string): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}api/photo/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await auth.getToken()}`,
      },
      body: JSON.stringify({
        weddingId,
        fileName,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get photo upload URL');
    }

    const { signedUrl, key } = await response.json();
    
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return key;
  };

  // Helper function to delete photos
  const deletePhotos = async (photoKeys: string[]): Promise<void> => {
    for (const key of photoKeys) {
      await fetch(`${import.meta.env.VITE_API_URL}api/photo/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({ key }),
      });
    }
  };

  // Helper function to process gifts
  const processGifts = async (weddingId: string) => {
    const giftResults = [];

    for (const gift of weddingDetails.giftItems) {
      // Skip gifts that already exist (have giftId) - only create new ones
      if (gift.giftId) {
        console.log('Skipping existing gift:', gift.name);
        continue;
      }

      let imageUrl = undefined;

      // Upload gift photo if exists
      if (gift.imageFile) {
        imageUrl = await uploadGiftPhoto(
          weddingId,
          gift.id,
          gift.imageFile
        );
      } else if (gift.imagePreview) {
        // If there's an existing image preview, use it directly
        imageUrl = gift.imagePreview;
      }

      // Create gift object
      const giftData = {
        id: gift.id || crypto.randomUUID(), // Ensure we always have an ID
        weddingId: weddingId,
        name: gift.name,
        description: gift.description || undefined,
        price: gift.price ? parseFloat(gift.price) : undefined,
        imageUrl: imageUrl || undefined, // Use undefined instead of null
        totalContributed: 0,
        isFullyFunded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating new gift with data:', giftData);
      giftResults.push(giftData);
    }

    // Create gifts in DynamoDB
    if (giftResults.length > 0) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify({
          gifts: giftResults
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create gifts:', errorData);
        throw new Error('Failed to create gifts');
      }

      const createdGifts = await response.json();
      console.log('Created gifts:', createdGifts);
      return createdGifts;
    }

    return [];
  };

  // Helper function to upload gift photo
  const uploadGiftPhoto = async (weddingId: string, giftId: string, file: File): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}api/gift-registry/photo-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await auth.getToken()}`,
      },
      body: JSON.stringify({
        giftId,
        fileName: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get gift photo upload URL');
    }

    const { signedUrl, key } = await response.json();
    
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // Return the full CloudFront URL instead of just the key
    return `${import.meta.env.VITE_BUCKET_URL}/${key}`;
  };

  // Helper function to get signed URL for a gift image
  const getGiftImageUrl = async (imageKey: string): Promise<string> => {
    // If it's already a CloudFront URL, return it directly
    if (imageKey.startsWith('http')) {
      return imageKey;
    }

    // Otherwise, it's an S3 key, so get a signed URL
    const [type, giftId, fileName] = imageKey.split('/');
    const response = await fetch(`${import.meta.env.VITE_API_URL}api/show-photo/${type}/${giftId}/${fileName}`, {
      headers: {
        Authorization: `Bearer ${await auth.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get gift image URL');
    }

    const { url } = await response.json();
    return url;
  };

  // Update the updateWedding function to include gift data
  const updateWedding = async (weddingId: string, photoUrls: string[], giftResults: any[]): Promise<void> => {
    const body = {
      weddingId,
      userId: auth.user?.email,
      title: weddingDetails.title,
      date: weddingDetails.date.toISOString(),
      time: weddingDetails.time,
      location: weddingDetails.location,
      story: weddingDetails.story,
      photoUrls,
      theme: weddingDetails.theme,
      primaryColor: weddingDetails.primaryColor,
      visibility: weddingDetails.visibility,
      password: weddingDetails.password,
      customUrl: weddingDetails.customUrl,
      language: weddingDetails.language,
      updatedAt: new Date().toISOString().split("T")[0],
      ...(isEditMode ? {} : { createdAt: new Date().toISOString().split("T")[0] }),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}api/wedding/${isEditMode ? 'update' : 'create'}`,
      {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await auth.getToken()}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} wedding:`, errorData);
      throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} wedding`);
    }

    const result = await response.json();
    console.log(`Wedding ${isEditMode ? 'updated' : 'created'} successfully:`, result);
  };

  const goToNextTab = () => {
    if (activeTab === "details") {
      setActiveTab("settings")
    } else if (activeTab === "settings") {
      setActiveTab("photos")
    } else if (activeTab === "photos") {
      setActiveTab("gifts")
    } else if (activeTab === "gifts") {
      setActiveTab("preview")
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "settings") {
      setActiveTab("details")
    } else if (activeTab === "photos") {
      setActiveTab("settings")
    } else if (activeTab === "gifts") {
      setActiveTab("photos")
    } else if (activeTab === "preview") {
      setActiveTab("gifts")
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? t('create.editWedding') : t('create.createWedding')}
        </h1>
        <Button 
          onClick={handleSubmit} 
          className="bg-pink-500 hover:bg-pink-600 min-w-[140px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? t('create.updating') : t('create.creating')}
            </>
          ) : (
            isEditMode ? t('create.updateWeddingPage') : t('create.createWeddingPage')
          )}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>
            {isEditMode ? t('create.weddingUpdatedSuccessfully') : t('create.weddingCreatedSuccessfully')}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-pink-500 font-medium">{t('loading.weddingDetails')}</p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">{t('create.weddingDetails')}</TabsTrigger>
                <TabsTrigger value="settings">{t('create.weddingSettings')}</TabsTrigger>
                <TabsTrigger value="photos">{t('create.weddingPhotos')}</TabsTrigger>
                <TabsTrigger value="gifts">{t('create.giftRegistry')}</TabsTrigger>
                <TabsTrigger value="preview">{t('create.preview')}</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('create.weddingDetails')}</CardTitle>
                    <CardDescription>
                      {t('create.fillBasicInfo')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">{t('create.weddingTitle')}</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder={t('create.weddingTitlePlaceholder')}
                          value={weddingDetails.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="date">{t('create.weddingDate')}</Label>
                          <DatePicker date={weddingDetails.date} setDate={handleDateChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">{t('create.weddingTime')}</Label>
                          <Input
                            id="time"
                            type="time"
                            value={weddingDetails.time}
                            onChange={(e) => setWeddingDetails(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">{t('create.weddingLocation')}</Label>
                        <LocationAutocomplete
                          id="location"
                          name="location"
                          placeholder={t('create.weddingLocationPlaceholder')}
                          value={weddingDetails.location}
                          onChange={(value) => setWeddingDetails(prev => ({ ...prev, location: value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story">{t('create.loveStory')}</Label>
                        <Textarea
                          id="story"
                          name="story"
                          placeholder={t('create.loveStoryPlaceholder')}
                          className="min-h-[150px]"
                          value={weddingDetails.story}
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to="/dashboard">
                      <Button variant="outline">{t('common.cancel')}</Button>
                    </Link>
                    <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600 min-w-[220px]">
                      {t('create.nextWeddingSettings')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('create.weddingSettings')}</CardTitle>
                    <CardDescription>{t('create.customizeWeddingPage')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('create.pageVisibility')}</h3>
                      <RadioGroup 
                        value={weddingDetails.visibility} 
                        onValueChange={(value) => setWeddingDetails(prev => ({ ...prev, visibility: value }))}
                        className="grid gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">{t('create.publicVisibility')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="password" id="password" />
                          <Label htmlFor="password">{t('create.passwordVisibility')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">{t('create.privateVisibility')}</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {weddingDetails.visibility === "password" && (
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('create.weddingPassword')}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={weddingDetails.password}
                          onChange={(e) => setWeddingDetails(prev => ({ ...prev, password: e.target.value }))}
                          placeholder={t('create.enterPassword')}
                          className="max-w-[300px]"
                        />
                        <p className="text-xs text-gray-500">{t('create.passwordDescription')}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="customUrl">{t('create.customUrl')}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">weddingwish.com/wedding/</span>
                        <Input
                          id="customUrl"
                          value={weddingDetails.customUrl}
                          className="max-w-[200px]"
                          onChange={(e) => {
                            // Only allow lowercase letters, numbers, and hyphens
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                            setWeddingDetails(prev => ({ ...prev, customUrl: value }));
                          }}
                        />
                        {urlValidation.isChecking ? (
                          <span className="text-sm text-gray-500">{t('create.checking')}</span>
                        ) : urlValidation.message && (
                          <span className={`text-sm ${urlValidation.isValid ? 'text-green-500' : 'text-red-500'}`}>
                            {urlValidation.message}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{t('create.customUrlDescription')}</p>
                    </div>

                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={goToPreviousTab}>
                      {t('common.back')}
                    </Button>
                    <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600 min-w-[140px]">
                      {t('create.nextPhotos')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('create.weddingPhotos')}</CardTitle>
                    <CardDescription>{t('create.uploadPhotos')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>{t('create.coverPhoto')}</Label>
                        <p className="text-sm text-gray-500">
                          {t('create.coverPhotoDescription')}
                        </p>
                        <CoverImageUploader 
                          onImageSelected={handleCoverPhotoChange}
                          onImageCleared={removeCoverPhoto}
                          preview={weddingDetails.coverPhotoPreview}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t('create.additionalPhotos')}</Label>
                        <p className="text-sm text-gray-500">{t('create.additionalPhotosDescription')}</p>
                        <p className="text-xs text-gray-500">{t('create.galleryPhotoOptimalSize')}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {weddingDetails.additionalPhotos.map((photo, index) => (
                            <div key={`photo-${index}-${photo.preview}`} className="relative aspect-square overflow-hidden rounded-lg border">
                              <img
                                src={photo.preview || "/placeholder.svg"}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div 
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 shadow-md z-50 cursor-pointer rounded-full p-1.5 transition-colors"
                                onClick={() => removeAdditionalPhoto(index)}
                                title={t('create.removePhoto')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </div>
                            </div>
                          ))}
                          <div className="aspect-square flex items-center justify-center border rounded-lg border-dashed">
                            <ImageUploader 
                              onImageSelected={handleAdditionalPhotoAdd}
                              className="w-full h-full flex items-center justify-center"
                              showPreview={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={goToPreviousTab}>
                      {t('common.back')}
                    </Button>
                    <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600 min-w-[140px]">
                      {t('create.nextGifts')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="gifts">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('create.giftRegistry')}</CardTitle>
                    <CardDescription>{t('create.addGiftItems')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t('create.addNewGiftItem')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                            <div className="flex items-center">
                              <ImageUploader 
                                onImageSelected={handleGiftImageSelected}
                                onImageCleared={() => setNewGiftItem((prev) => ({ ...prev, imageFile: null, imagePreview: "" }))}
                                preview={newGiftItem.imagePreview}
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="gift-name">{t('create.giftName')}</Label>
                                <Input
                                  id="gift-name"
                                  name="name"
                                  value={newGiftItem.name}
                                  onChange={handleNewGiftItemChange}
                                  placeholder={t('create.giftNamePlaceholder')}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gift-price">{t('create.priceSek')}</Label>
                                <Input
                                  id="gift-price"
                                  name="price"
                                  type="number"
                                  value={newGiftItem.price}
                                  onChange={handleNewGiftItemChange}
                                  placeholder="0.00"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gift-description">{t('create.description')}</Label>
                                <Textarea
                                  id="gift-description"
                                  name="description"
                                  value={newGiftItem.description}
                                  onChange={handleNewGiftItemChange}
                                  placeholder={t('create.giftDescriptionPlaceholder')}
                                  className="min-h-[100px]"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={addGiftItem} className="flex items-center bg-pink-500 hover:bg-pink-600">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('create.addGiftItem')}
                          </Button>
                        </CardFooter>
                      </Card>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('create.yourGiftRegistry')}</h3>
                        {weddingDetails.giftItems.length === 0 ? (
                          <Card className="text-center p-6">
                            <p className="text-gray-500">{t('create.noGiftsAdded')}</p>
                          </Card>
                        ) : (
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {weddingDetails.giftItems.map((item) => (
                              <Card key={item.id} className="overflow-hidden">
                                <div className="aspect-video bg-gray-100 relative">
                                  {item.imagePreview ? (
                                    <img
                                      src={item.imagePreview}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      {t('create.noImage')}
                                    </div>
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold">{item.name}</h3>
                                      <p className="text-sm text-gray-500">{item.description}</p>
                                      <p className="font-medium mt-2">{item.price} sek</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeGiftItem(item.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={goToPreviousTab}>
                      {t('common.back')}
                    </Button>
                    <Button onClick={goToNextTab} className="bg-pink-500 hover:bg-pink-600 min-w-[140px]">
                      {t('create.nextPreview')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('create.previewWeddingPage')}</CardTitle>
                    <CardDescription>{t('create.previewDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme and Color Settings */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="theme">{t('create.pageTheme')}</Label>
                        <Select
                          value={weddingDetails.theme}
                          onValueChange={(value) => setWeddingDetails(prev => ({ ...prev, theme: value }))}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder={t('create.selectTheme')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="classic">{t('create.classic')}</SelectItem>
                            <SelectItem value="romanticClassic">{t('create.romanticClassic')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">{t('create.primaryColor')}</Label>
                        <Select
                          value={weddingDetails.primaryColor}
                          onValueChange={(value) => setWeddingDetails(prev => ({ ...prev, primaryColor: value }))}
                        >
                          <SelectTrigger id="primaryColor">
                            <SelectValue placeholder={t('create.selectColor')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pink">{t('create.pink')}</SelectItem>
                            <SelectItem value="rosePetal">{t('create.rosePetal')}</SelectItem>
                            <SelectItem value="lavender">{t('create.lavender')}</SelectItem>
                            <SelectItem value="sageGreen">{t('create.sageGreen')}</SelectItem>
                            <SelectItem value="dustyBlue">{t('create.dustyBlue')}</SelectItem>
                            <SelectItem value="vintageGold">{t('create.vintageGold')}</SelectItem>
                            <SelectItem value="deepNavy">{t('create.deepNavy')}</SelectItem>
                            <SelectItem value="champagne">{t('create.champagne')}</SelectItem>
                            <SelectItem value="mauve">{t('create.mauve')}</SelectItem>
                            <SelectItem value="eucalyptus">{t('create.eucalyptus')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">{t('create.weddingLanguage')}</Label>
                        <Select
                          value={weddingDetails.language}
                          onValueChange={(value: "en" | "sv") => setWeddingDetails(prev => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder={t('create.selectLanguage')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">{t('create.english')}</SelectItem>
                            <SelectItem value="sv">{t('create.swedish')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t('create.livePreview')}</h3>
                      <WeddingPreview weddingDetails={weddingDetails} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={goToPreviousTab}>
                      {t('common.back')}
                    </Button>
                    <Button onClick={handleSubmit} className="bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
                      {isSubmitting ? (isEditMode ? t('create.updating') : t('create.creating')) : (isEditMode ? t('create.updateWeddingPage') : t('create.createWeddingPage'))}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
    </div>
  )
}

