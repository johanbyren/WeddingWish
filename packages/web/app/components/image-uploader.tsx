import { useState, useRef } from "react"
import { ImagePlus } from "lucide-react"
import { Button } from "./ui/button"

interface ImageUploaderProps {
  onImageSelected: (file: File) => void
  className?: string
  preview?: string
}

export function ImageUploader({ onImageSelected, className, preview: initialPreview }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded-md object-cover"
          />
        </div>
      )}
    </div>
  )
} 