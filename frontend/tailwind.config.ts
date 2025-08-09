import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						filter: 'drop-shadow(0 0 10px currentColor)'
					},
					'50%': {
						opacity: '0.7',
						filter: 'drop-shadow(0 0 20px currentColor)'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-right': {
					from: {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					to: {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-left': {
					from: {
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					to: {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-out-left': {
					from: {
						transform: 'translateX(0)',
						opacity: '1'
					},
					to: {
						transform: 'translateX(-100%)',
						opacity: '0'
					}
				},
				'slide-out-right': {
					from: {
						transform: 'translateX(0)',
						opacity: '1'
					},
					to: {
						transform: 'translateX(100%)',
						opacity: '0'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 3px hsl(var(--primary)), 0 0 6px hsl(var(--primary))'
					},
					'50%': {
						boxShadow: '0 0 6px hsl(var(--primary)), 0 0 12px hsl(var(--primary))'
					}
				},
				'cyber-flicker': {
					'0%, 100%': {
						opacity: '1'
					},
					'98%': {
						opacity: '1'
					},
					'99%': {
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-right': 'slide-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-left': 'slide-left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-out-left': 'slide-out-left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-out-right': 'slide-out-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'neon-pulse': 'neon-pulse 4s ease-in-out infinite',
				'cyber-flicker': 'cyber-flicker 3s linear infinite'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-danger': 'var(--gradient-danger)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-cyber': 'var(--gradient-cyber)'
			},
			boxShadow: {
				'primary': 'var(--shadow-primary)',
				'secondary': 'var(--shadow-secondary)',
				'accent': 'var(--shadow-accent)',
				'danger': 'var(--shadow-danger)',
				'success': 'var(--shadow-success)',
				'cyber': 'var(--shadow-cyber)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
