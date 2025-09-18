# Wedding Themes

This folder contains the different theme components for wedding pages. Each theme provides a completely different layout and design while maintaining the same functionality.

## Structure

```
themes/
├── README.md                    # This file
├── types.ts                     # Shared TypeScript types
├── index.ts                     # Theme registry and exports
├── ClassicTheme.tsx            # Classic theme component
├── RomanticClassicTheme.tsx    # Romantic Classic theme component
└── [FutureTheme].tsx           # Future theme components
```

## How It Works

1. **Theme Components**: Each theme is a separate React component that implements the `ThemeComponentProps` interface
2. **Theme Registry**: The `index.ts` file maps theme names to their components using lazy loading
3. **Dynamic Loading**: Themes are loaded dynamically based on the wedding's theme setting
4. **Shared Types**: All themes use the same props interface defined in `types.ts`

## Adding a New Theme

To add a new theme:

1. Create a new component file (e.g., `ModernMinimalistTheme.tsx`)
2. Implement the `ThemeComponentProps` interface
3. Add the theme to the `themeComponents` registry in `index.ts`
4. Add the theme option to the create page selector
5. Add translations for the theme name

## Current Themes

- **Classic**: Traditional, simple layout with header navigation
- **Romantic Classic**: Elegant, full-screen hero design with detailed sections

## Color System

All themes work with the universal color palette system defined in `~/utils/themes.ts`. The color is applied dynamically through CSS variables, so any theme can use any color combination.
