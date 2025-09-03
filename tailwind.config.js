/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // OCPP Brand Colors
        primary: {
          50: '#F4FFAB',
          100: '#E8FF7F',
          200: '#D7EB57',
          300: '#ACED2E',
          400: '#93D526',
          500: '#539C06',
          600: '#4A8C05',
          700: '#3D7304',
          800: '#2F5A03',
          900: '#213A04',
          950: '#152602',
        },
        
        // Dark Theme Colors
        dark: {
          bg: {
            primary: '#0A0A0A',
            secondary: '#152602',
            tertiary: '#213A04',
            quaternary: '#182b03',
          },
          border: {
            primary: '#5AA00B',
            secondary: '#213A04',
            tertiary: '#484848',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#989E92',
            accent: '#ACED2E',
            muted: '#484848',
          }
        },
        
        // Light Theme Colors
        light: {
          bg: {
            primary: '#FFFFFF',
            secondary: '#F4FFAB',
            tertiary: '#e2e8f0',
            quaternary: '#f8fafc',
          },
          border: {
            primary: '#539C06',
            secondary: '#e5e7eb',
            tertiary: '#d1d5db',
          },
          text: {
            primary: '#111827',
            secondary: '#6b7280',
            accent: '#539C06',
            muted: '#9ca3af',
          }
        },
        
        // Status Colors
        status: {
          success: {
            light: '#10b981',
            dark: '#34d399',
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
          },
          info: {
            light: '#3b82f6',
            dark: '#60a5fa',
          }
        },
        
        // Interactive Colors
        interactive: {
          hover: {
            light: '#f3f4f6',
            dark: '#213A04',
          },
          focus: {
            light: '#539C06',
            dark: '#ACED2E',
          },
          disabled: {
            light: '#e5e7eb',
            dark: '#484848',
          }
        },
        
        // Legacy support for existing classes
        background: "#f9fafb",
        foreground: "#111",
        muted: "#6b7280"
      },
      
      fontSize: {
        // Display sizes
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        
        // Heading sizes
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.45', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-xs': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        
        // Body text sizes
        'body-xl': ['1.125rem', { lineHeight: '1.6' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.4' }],
        
        // Caption sizes
        'caption-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-md': ['0.8125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'caption-xs': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500' }],
        
        // Button sizes
        'button-lg': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'button-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '600' }],
        'button-sm': ['0.8125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'button-xs': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        
        // Label sizes
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.01em' }],
        'label-md': ['0.8125rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.01em' }],
        'label-sm': ['0.75rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.02em' }],
        'label-xs': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'theme-sm': '0 1px 3px 0 rgb(83 156 6 / 0.1), 0 1px 2px -1px rgb(83 156 6 / 0.1)',
        'theme-md': '0 4px 6px -1px rgb(83 156 6 / 0.1), 0 2px 4px -2px rgb(83 156 6 / 0.1)',
        'theme-lg': '0 10px 15px -3px rgb(83 156 6 / 0.1), 0 4px 6px -4px rgb(83 156 6 / 0.1)',
      },
      
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #539C06 0%, #D7EB57 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #539C06 0%, #D7EB57 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, #539C06 0%, #6BB00F 100%)',
        'gradient-bg-dark': 'linear-gradient(135deg, #0A0A0A 0%, #152602 100%)',
        'gradient-bg-light': 'linear-gradient(135deg, #F4FFAB 0%, #e2e8f0 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, #213A04 0%, #182b03 100%)',
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
      
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    }
  },
  plugins: []
};

