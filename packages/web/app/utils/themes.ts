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
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    borderRadius: string;
    shadow: string;
    border: string;
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
      textSecondary: "#6b7280"
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans"
    },
    styles: {
      borderRadius: "rounded-lg",
      shadow: "shadow-lg",
      border: "border border-gray-200"
    }
  },
  modern: {
    name: "Modern",
    colors: {
      primary: "var(--primary-color)",
      primaryHover: "var(--primary-hover-color)",
      secondary: "var(--secondary-color)",
      accent: "var(--accent-color)",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      text: "#0f172a",
      textSecondary: "#475569"
    },
    fonts: {
      heading: "font-sans font-bold",
      body: "font-sans"
    },
    styles: {
      borderRadius: "rounded-xl",
      shadow: "shadow-xl",
      border: "border-2 border-gray-300"
    }
  }
};

export const colors: Record<string, ColorConfig> = {
  pink: {
    name: "Pink",
    primary: "#ec4899",
    primaryHover: "#db2777",
    secondary: "#fce7f3",
    accent: "#f9a8d4"
  },
  blue: {
    name: "Blue",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#dbeafe",
    accent: "#93c5fd"
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
  } as React.CSSProperties;
}
