export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    cardBorder: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  styles: {
    borderRadius: string;
    shadow: string;
    border: string;
    cardShadow: string;
    heroGradient: string;
  };
  animations: {
    transition: string;
    hover: string;
  };
}

export interface ColorConfig {
  name: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
}

export const themes: Record<string, ThemeConfig> = {
  classic: {
    name: "Classic",
    colors: {
      primary: "var(--primary-color)",
      primaryHover: "var(--primary-hover-color)",
      secondary: "var(--secondary-color)",
      accent: "var(--accent-color)",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      text: "#1f2937",
      textSecondary: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
      muted: "#f9fafb"
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
      accent: "font-serif font-light"
    },
    styles: {
      borderRadius: "rounded-lg",
      shadow: "shadow-lg",
      border: "border border-gray-200",
      cardShadow: "shadow-md hover:shadow-lg",
      heroGradient: "bg-gradient-to-br from-primary/5 via-background to-accent/10"
    },
    animations: {
      transition: "transition-all duration-300 ease-in-out",
      hover: "hover:scale-105 transition-transform duration-300"
    }
  },
  romanticClassic: {
    name: "Romantic Classic",
    colors: {
      primary: "var(--primary-color)",
      primaryHover: "var(--primary-hover-color)",
      secondary: "var(--secondary-color)",
      accent: "var(--accent-color)",
      background: "linear-gradient(135deg, #fdf8f6 0%, #fef7f0 50%, #fdf2f8 100%)",
      text: "#374151",
      textSecondary: "#6b7280",
      card: "rgba(255, 255, 255, 0.8)",
      cardBorder: "rgba(236, 72, 153, 0.1)",
      muted: "#fef7f0"
    },
    fonts: {
      heading: "font-serif font-light tracking-wide",
      body: "font-sans",
      accent: "font-serif italic"
    },
    styles: {
      borderRadius: "rounded-2xl",
      shadow: "shadow-xl",
      border: "border border-pink-100",
      cardShadow: "shadow-lg hover:shadow-2xl backdrop-blur-sm",
      heroGradient: "bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
    },
    animations: {
      transition: "transition-all duration-500 ease-out",
      hover: "hover:scale-105 hover:rotate-1 transition-all duration-300"
    }
  }
};

export const colors: Record<string, ColorConfig> = {
  pink: {
    name: "Blush Pink",
    primary: "#ec4899",
    primaryHover: "#db2777",
    secondary: "#fce7f3",
    accent: "#f9a8d4"
  },
  rosePetal: {
    name: "Rose Petal",
    primary: "#f43f5e",
    primaryHover: "#e11d48",
    secondary: "#fdf2f8",
    accent: "#fda4af"
  },
  lavender: {
    name: "Lavender",
    primary: "#a855f7",
    primaryHover: "#9333ea",
    secondary: "#f3e8ff",
    accent: "#c4b5fd"
  },
  sageGreen: {
    name: "Sage Green",
    primary: "#22c55e",
    primaryHover: "#16a34a",
    secondary: "#f0fdf4",
    accent: "#86efac"
  },
  dustyBlue: {
    name: "Dusty Blue",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#dbeafe",
    accent: "#93c5fd"
  },
  vintageGold: {
    name: "Vintage Gold",
    primary: "#d97706",
    primaryHover: "#b45309",
    secondary: "#fef3c7",
    accent: "#fbbf24"
  },
  deepNavy: {
    name: "Deep Navy",
    primary: "#1e40af",
    primaryHover: "#1d4ed8",
    secondary: "#dbeafe",
    accent: "#60a5fa"
  },
  champagne: {
    name: "Champagne",
    primary: "#ca8a04",
    primaryHover: "#a16207",
    secondary: "#fefce8",
    accent: "#facc15"
  },
  mauve: {
    name: "Mauve",
    primary: "#be185d",
    primaryHover: "#9d174d",
    secondary: "#fdf2f8",
    accent: "#f472b6"
  },
  eucalyptus: {
    name: "Eucalyptus",
    primary: "#059669",
    primaryHover: "#047857",
    secondary: "#ecfdf5",
    accent: "#34d399"
  }
};

export function getThemeConfig(theme: string, color: string): ThemeConfig {
  const baseTheme = themes[theme] || themes.classic;
  const colorConfig = colors[color] || colors.pink;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colorConfig.primary,
      primaryHover: colorConfig.primaryHover,
      secondary: colorConfig.secondary,
      accent: colorConfig.accent
    }
  };
}

export function getThemeStyles(theme: string, color: string): React.CSSProperties {
  const config = getThemeConfig(theme, color);
  
  return {
    '--primary-color': config.colors.primary,
    '--primary-hover-color': config.colors.primaryHover,
    '--secondary-color': config.colors.secondary,
    '--accent-color': config.colors.accent,
    '--background-color': config.colors.background,
    '--text-color': config.colors.text,
    '--text-secondary-color': config.colors.textSecondary,
    '--card-color': config.colors.card,
    '--card-border-color': config.colors.cardBorder,
    '--muted-color': config.colors.muted,
    '--theme-font-heading': config.fonts.heading,
    '--theme-font-body': config.fonts.body,
    '--theme-font-accent': config.fonts.accent,
    '--theme-border-radius': config.styles.borderRadius,
    '--theme-shadow': config.styles.shadow,
    '--theme-border': config.styles.border,
    '--theme-card-shadow': config.styles.cardShadow,
    '--theme-hero-gradient': config.styles.heroGradient,
    '--theme-transition': config.animations.transition,
    '--theme-hover': config.animations.hover,
  } as React.CSSProperties;
}
