import { lazy } from "react"
import type { ThemeComponentProps } from "./types"

// Lazy load theme components for better performance
const ClassicTheme = lazy(() => import("./ClassicTheme"))
const RomanticClassicTheme = lazy(() => import("./RomanticClassicTheme"))

// Theme registry - maps theme names to their components
export const themeComponents: Record<string, React.LazyExoticComponent<React.ComponentType<ThemeComponentProps>>> = {
  classic: ClassicTheme,
  romanticClassic: RomanticClassicTheme,
}

// Helper function to get theme component
export function getThemeComponent(themeName: string) {
  return themeComponents[themeName] || themeComponents.classic
}

// Export types for convenience
export type { ThemeComponentProps, Wedding, Gift } from "./types"
