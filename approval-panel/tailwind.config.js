import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				skeleton: 'var(--skeleton)',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				// Vibrant color palette
				vibrant: {
					blue: '#3b82f6',
					green: '#22c55e',
					amber: '#f59e0b',
					red: '#ef4444',
					purple: '#a855f7',
					pink: '#ec4899',
					cyan: '#06b6d4',
					orange: '#f97316',
					teal: '#14b8a6',
					violet: '#8b5cf6',
				}
			},
			backgroundImage: {
				'rainbow-gradient': 'linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b, #ef4444, #8b5cf6)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			boxShadow: {
				input: [
					"0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
					"0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
					"0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
				].join(", "),
			},
			animation: {
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'gradient-rotate': 'gradient-rotate 3s ease infinite',
				'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
				'ripple': 'ripple 2s ease calc(var(--i, 0) * 0.2s) infinite',
				'orbit': 'orbit calc(var(--duration) * 1s) linear infinite',
			},
			keyframes: {
				'gradient-shift': {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
				},
				'gradient-rotate': {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.8)', opacity: '1' },
					'100%': { transform: 'scale(2)', opacity: '0' },
				},
				'ripple': {
					'0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
					'50%': { transform: 'translate(-50%, -50%) scale(0.9)' },
				},
				'orbit': {
					'0%': {
						transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)',
					},
					'100%': {
						transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)',
					},
				},
			},
		}
	},
	plugins: [tailwindcssAnimate],
}

