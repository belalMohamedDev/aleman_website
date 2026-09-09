export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5F1',
          100: '#D8E5DA',
          200: '#B0C9B5',
          300: '#7BA886',
          400: '#4E8A5A',
          500: '#2D6A3F',
          600: '#1E4D30',
          700: '#173D26',
          800: '#112D1C',
          900: '#0B1E13',
        },
        gold: {
          50: '#FFF6E9',
          100: '#FFE7C2',
          200: '#FFD08A',
          300: '#FFB74D',
          400: '#FF9800',
          500: '#F57C00',
          600: '#D96C00',
          700: '#A65200',
        },
        darkSlate: {
          DEFAULT: '#111827',
          card: '#1F2937',
          accent: '#1E293B',
        },
        ink: {
          DEFAULT: '#112D1C',
          soft: '#263238',
          muted: '#5B6B60',
        },
        canvas: '#F8F9FA',
      },
      fontFamily: {
        ar: ['Cairo', 'system-ui', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 4px rgba(23, 53, 27, 0.04), 0 12px 32px rgba(23, 53, 27, 0.06)',
        lift: '0 8px 16px rgba(23, 53, 27, 0.08), 0 24px 48px rgba(23, 53, 27, 0.10)',
      },
      maxWidth: {
        site: '1280px',
      },
    },
  },
}
