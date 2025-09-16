"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  name?: string
  required?: boolean
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: { input: string; componentRestrictions?: { country: string } },
              callback: (predictions: any[] | null, status: any) => void
            ) => void
          }
          PlacesServiceStatus: {
            OK: string
          }
        }
      }
    }
  }
}

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  id,
  name,
  required
}: LocationAutocompleteProps) {
  const [predictions, setPredictions] = useState<string[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autocompleteService = useRef<InstanceType<typeof window.google.maps.places.AutocompleteService> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const predictionsRef = useRef<HTMLDivElement>(null)

  // Initialize Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      setError('Google Maps API key not found')
      setIsGoogleLoaded(true)
      return
    }

    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true)
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsGoogleLoaded(true)
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
      })
      existingScript.addEventListener('error', () => {
        setError('Failed to load Google Maps API')
        setIsGoogleLoaded(true)
      })
      return
    }

    // Load Google Maps API
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsGoogleLoaded(true)
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
    script.onerror = () => {
      setError('Failed to load Google Maps API')
      setIsGoogleLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  // Get place predictions function
  const getPlacePredictions = useCallback((input: string) => {
    if (!autocompleteService.current || !input.trim()) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    autocompleteService.current.getPlacePredictions(
      { 
        input,
        componentRestrictions: { country: 'se' } // Restrict to Sweden
      },
      (predictions: any[] | null, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const predictionStrings = predictions.map((prediction: any) => prediction.description)
          setPredictions(predictionStrings)
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }, [])

  // Debounced version of getPlacePredictions
  const debouncedGetPlacePredictions = useCallback(
    debounce(getPlacePredictions, 300),
    [getPlacePredictions]
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)
    
    if (isGoogleLoaded && !error) {
      debouncedGetPlacePredictions(inputValue)
    }
  }

  // Handle prediction selection
  const handlePredictionSelect = (prediction: string) => {
    onChange(prediction)
    setShowPredictions(false)
    setPredictions([])
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true)
    }
  }

  // Handle clicks outside to close predictions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        predictionsRef.current && 
        !predictionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        required={required}
        className="w-full"
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
      />
      
      {showPredictions && predictions.length > 0 && (
        <div 
          ref={predictionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <div className="text-sm text-gray-900">
                {prediction}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error} - Using manual input
        </p>
      )}
      
      {!isGoogleLoaded && !error && (
        <p className="text-xs text-gray-500 mt-1">
          Loading location suggestions...
        </p>
      )}
    </div>
  )
}