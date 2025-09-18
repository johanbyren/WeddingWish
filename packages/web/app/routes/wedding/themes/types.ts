import type { ThemeConfig } from "~/utils/themes"

export interface Gift {
  giftId: string;
  name: string;
  description: string;
  price: number;
  totalContributed: number;
  imageUrl: string | null;
  isFullyFunded: boolean;
}

export interface Wedding {
  weddingId: string
  userId: string
  title: string
  date: string
  location: string
  story: string
  photoUrls: string[]
  visibility?: string
  customUrl?: string
  theme?: string
  primaryColor?: string
  language?: "en" | "sv"
  createdAt?: string
  updatedAt?: string
  paymentSettings?: any
  languageSettings?: {
    language: "en" | "sv"
  }
}

export interface ThemeComponentProps {
  wedding: Wedding;
  gifts: Gift[];
  themeConfig: ThemeConfig;
  themeStyles: React.CSSProperties;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  handleImageClick: (image: string) => void;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  formatWeddingDateTime: (date: string) => { date: string; time: string };
  navigate: (path: string, options?: any) => void;
  slug: string | undefined;
  giftImages: Record<string, string>;
  t: (key: string) => string;
}
