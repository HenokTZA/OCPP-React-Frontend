# OCPP Dashboard Design System

## Color Palette

### Primary Brand Colors
- `primary-50` to `primary-950`: Full brand color scale
- Key colors: `primary-500` (#539C06), `primary-300` (#ACED2E), `primary-200` (#D7EB57)

### Theme-Aware Colors

#### Dark Theme
```jsx
// Backgrounds
bg-dark-bg-primary      // #0A0A0A - Main dark background
bg-dark-bg-secondary    // #152602 - Secondary dark background
bg-dark-bg-tertiary     // #213A04 - Card backgrounds
bg-dark-bg-quaternary   // #182b03 - Subtle backgrounds

// Borders
border-dark-border-primary    // #5AA00B - Primary borders
border-dark-border-secondary  // #213A04 - Secondary borders
border-dark-border-tertiary   // #484848 - Subtle borders

// Text
text-dark-text-primary    // #FFFFFF - Primary text
text-dark-text-secondary  // #989E92 - Secondary text
text-dark-text-accent     // #ACED2E - Accent text
text-dark-text-muted      // #484848 - Muted text
```

#### Light Theme
```jsx
// Backgrounds
bg-light-bg-primary      // #FFFFFF - Main light background
bg-light-bg-secondary    // #F4FFAB - Secondary light background
bg-light-bg-tertiary     // #e2e8f0 - Card backgrounds
bg-light-bg-quaternary   // #f8fafc - Subtle backgrounds

// Borders
border-light-border-primary    // #539C06 - Primary borders
border-light-border-secondary  // #e5e7eb - Secondary borders
border-light-border-tertiary   // #d1d5db - Subtle borders

// Text
text-light-text-primary    // #111827 - Primary text
text-light-text-secondary  // #6b7280 - Secondary text
text-light-text-accent     // #539C06 - Accent text
text-light-text-muted      // #9ca3af - Muted text
```

### Status Colors
```jsx
// Success
text-status-success-light    // #10b981
text-status-success-dark     // #34d399

// Warning
text-status-warning-light    // #f59e0b
text-status-warning-dark     // #fbbf24

// Error
text-status-error-light      // #ef4444
text-status-error-dark       // #f87171

// Info
text-status-info-light       // #3b82f6
text-status-info-dark        // #60a5fa
```

### Interactive Colors
```jsx
// Hover states
bg-interactive-hover-light   // #f3f4f6
bg-interactive-hover-dark    // #213A04

// Focus states
ring-interactive-focus-light // #539C06
ring-interactive-focus-dark  // #ACED2E

// Disabled states
bg-interactive-disabled-light // #e5e7eb
bg-interactive-disabled-dark  // #484848
```

## Typography Scale

### Display Text (Hero sections, landing pages)
```jsx
text-display-xl    // 72px, line-height: 1.1
text-display-lg    // 60px, line-height: 1.1
text-display-md    // 48px, line-height: 1.15
text-display-sm    // 36px, line-height: 1.2
```

### Headings (Page titles, section headers)
```jsx
text-heading-xl    // 30px, font-weight: 700
text-heading-lg    // 24px, font-weight: 600
text-heading-md    // 20px, font-weight: 600
text-heading-sm    // 18px, font-weight: 600
text-heading-xs    // 16px, font-weight: 600
```

### Body Text (Paragraphs, general content)
```jsx
text-body-xl       // 18px, line-height: 1.6
text-body-lg       // 16px, line-height: 1.6
text-body-md       // 14px, line-height: 1.5
text-body-sm       // 13px, line-height: 1.5
text-body-xs       // 12px, line-height: 1.4
```

### Captions (Metadata, helper text)
```jsx
text-caption-lg    // 14px, font-weight: 500
text-caption-md    // 13px, font-weight: 500
text-caption-sm    // 12px, font-weight: 500
text-caption-xs    // 11px, font-weight: 500
```

### Button Text
```jsx
text-button-lg     // 16px, font-weight: 600
text-button-md     // 14px, font-weight: 600
text-button-sm     // 13px, font-weight: 600
text-button-xs     // 12px, font-weight: 500
```

### Labels (Form labels, tags)
```jsx
text-label-lg      // 14px, font-weight: 500, letter-spacing: 0.01em
text-label-md      // 13px, font-weight: 500, letter-spacing: 0.01em
text-label-sm      // 12px, font-weight: 500, letter-spacing: 0.02em
text-label-xs      // 11px, font-weight: 500, letter-spacing: 0.02em
```

## Background Gradients

### Primary Gradients
```jsx
bg-gradient-primary       // Default brand gradient
bg-gradient-primary-dark  // Dark theme variant
bg-gradient-primary-light // Light theme variant
```

### Background Gradients
```jsx
bg-gradient-bg-dark   // Dark theme background gradient
bg-gradient-bg-light  // Light theme background gradient
bg-gradient-card-dark // Dark theme card gradient
```

## Shadows

### Standard Shadows
```jsx
shadow-sm    // Subtle shadow
shadow-md    // Medium shadow
shadow-lg    // Large shadow
shadow-xl    // Extra large shadow
```

### Theme Shadows (Green tinted)
```jsx
shadow-theme-sm  // Subtle green shadow
shadow-theme-md  // Medium green shadow
shadow-theme-lg  // Large green shadow
```

## Animations

### Custom Animations
```jsx
animate-spin-slow   // Slow spinning animation
animate-pulse-slow  // Slow pulse animation
animate-fade-in     // Fade in animation
animate-slide-up    // Slide up animation
animate-slide-down  // Slide down animation
```

## Usage Examples

### Theme-Aware Component
```jsx
const ThemeAwareCard = ({ isDark, children }) => (
  <div className={`p-6 rounded-xl ${
    isDark 
      ? "bg-dark-bg-tertiary border-dark-border-primary text-dark-text-primary" 
      : "bg-light-bg-primary border-light-border-secondary text-light-text-primary"
  }`}>
    {children}
  </div>
);
```

### Button Component
```jsx
const Button = ({ variant = 'primary', size = 'md', isDark, children }) => (
  <button className={`
    rounded-lg transition-all duration-200
    ${size === 'lg' ? 'px-6 py-3 text-button-lg' : 'px-4 py-2 text-button-md'}
    ${variant === 'primary' 
      ? isDark 
        ? 'bg-gradient-primary-dark text-black' 
        : 'bg-gradient-primary-light text-white'
      : isDark
        ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border-primary'
        : 'bg-light-bg-primary text-light-text-primary border-light-border-secondary'
    }
  `}>
    {children}
  </button>
);
```

### Typography Component
```jsx
const Heading = ({ level = 'md', isDark, children }) => (
  <h2 className={`
    text-heading-${level}
    ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
  `}>
    {children}
  </h2>
);
```

## Migration Guide

### Old vs New Classes

#### Colors
```jsx
// Old
className="text-[#ACED2E]"
// New
className="text-dark-text-accent"

// Old
className="bg-[#213A04]"
// New
className="bg-dark-bg-tertiary"
```

#### Typography
```jsx
// Old
className="text-3xl font-bold"
// New
className="text-heading-xl"

// Old
className="text-sm font-medium"
// New
className="text-caption-lg"
```

#### Gradients
```jsx
// Old
className="bg-gradient-to-r from-[#539C06] to-[#D7EB57]"
// New
className="bg-gradient-primary-dark"
```

This design system ensures consistency across the entire application while maintaining the flexibility to add new variations as needed.
