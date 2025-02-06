import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'gray-scales-black': '#272343',
  			'gray-scales-white': '#fff',
  			'gray-scales-off-white': '#f0f2f3',
  			'accents-dark-accents': '#007580',
  			'gray-scales-dark-gray': '#636270',
  			whitesmoke: '#f7f7f7',
  			teal: '#007580',
  			whitesmoke1: 'rgba(249, 249, 249, 0.15)',
  			white: '#fff',
  			'gray-1': '#333',
  			'gray-2': '#4f4f4f',
  			'status-success': '#01ad5a',
  			'gray-scales-gray': '#9a9caa',
  			'accents-accents': '#029fae',
  			gainsboro: '#d9d9d9',
  			darkcyan: '#029fae',
  			gray: {
  				'100': '#757575',
  				'200': '#111',
  				'300': 'rgba(255, 255, 255, 0)',
  				gray: 'rgba(0, 0, 0, 0.7)'
  			},
  			black: '#000',
  			darkgray: '#9a9caa',
  			'dark-primary': '#2a254b',
  			'status-warning': '#f5813f',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
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
  			}
  		},
  		spacing: {},
  		fontFamily: {
  			inter: 'Inter',
  			'nav-links': 'Inter',
  			poppins: 'Poppins',
  			'sale-price': 'Inter',
  			'body-medium': 'Satoshi',
  			'headings-h4': 'Clash Display',
  			'dm-sans': 'DM Sans',
  			h2: 'Roboto'
  		},
  		borderRadius: {
  			'3xs': '10px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	fontSize: {
  		smi: '13px',
  		'31xl': '50px',
  		base: '16px',
  		inherit: 'inherit',
  		sm: '14px',
  		xl: '20px',
  		'3xs': '10px',
  		lg: '18px'
  	}
  },
  corePlugins: {
    preflight: false,
  },
    plugins: [require("tailwindcss-animate")]
};
export default config;
