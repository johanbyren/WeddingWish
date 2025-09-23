import { useState, useRef, useEffect } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { useTranslation } from "~/context/translation"

interface ImageUploaderProps {
  onImageSelected: (file: File) => void
  onImageCleared?: () => void
  className?: string
  preview?: string
  showPreview?: boolean
}

export function ImageUploader({ onImageSelected, onImageCleared, className, preview: initialPreview, showPreview = true }: ImageUploaderProps) {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync internal preview state with external preview prop
  useEffect(() => {
    setPreview(initialPreview || null)
  }, [initialPreview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('ImageUploader handleFileChange called with file:', file?.name, file?.size);
    
    if (file) {
      console.log('Calling onImageSelected with file:', file.name);
      onImageSelected(file)
      
      // Only set preview if showPreview is true
      if (showPreview) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageCleared?.()
  }
  
  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {!preview || !showPreview ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          {t('create.uploadImage')}
        </Button>
      ) : (
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 cursor-pointer rounded-full flex items-center justify-center z-50 shadow-lg border border-gray-200"
            onClick={handleClearImage}
          >
            <Trash2 className="h-4 w-4 text-black" />
          </div>
        </div>
      )}
    </div>
  )
} 