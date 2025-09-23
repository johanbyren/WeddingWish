import { useState, useRef, useEffect } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { useTranslation } from "~/context/translation"

interface CoverImageUploaderProps {
  onImageSelected: (file: File) => void
  onImageCleared?: () => void
  className?: string
  preview?: string | null
  showPreview?: boolean
}

export function CoverImageUploader({ 
  onImageSelected, 
  onImageCleared, 
  className, 
  preview: initialPreview, 
  showPreview = true 
}: CoverImageUploaderProps) {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync internal preview state with external preview prop
  useEffect(() => {
    setPreview(initialPreview || null)
    // Clear file input when preview is cleared by parent
    if (!initialPreview && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [initialPreview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelected(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClearImage = () => {
    // Don't clear the preview immediately - let the parent handle confirmation
    // The parent will call onImageCleared which may show a confirmation dialog
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
      {!preview ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {t('create.uploadImage')}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            {t('create.coverPhotoOptimalSize')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Preview Container - shows correct 3:1 aspect ratio */}
          <div className="relative aspect-[3/1] overflow-hidden rounded-lg border bg-gray-100">
            <img
              src={preview}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Clear button */}
            <div
              className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 cursor-pointer rounded-full flex items-center justify-center z-50 shadow-lg border border-gray-200"
              onClick={handleClearImage}
            >
              <Trash2 className="h-4 w-4 text-black" />
            </div>
          </div>

          {/* Optimal size info */}
          <p className="text-xs text-gray-500 text-center">
            {t('create.coverPhotoOptimalSize')}
          </p>
        </div>
      )}
    </div>
  )
}
