/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#060913',
          secondary: '#0b1120',
          tertiary: '#0f172a',
          elevated: '#131e36',
        },
        panel: {
          DEFAULT: '#0d1527',
          header: '#111b33',
          hover: '#162344',
          border: '#1e2e50',
          borderLight: '#2a3e6a',
        },
        cyber: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          violet: '#a78bfa',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
