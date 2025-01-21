/**
 * Configuration module for the application
 * Validates and exports environment variables with proper TypeScript types
 */

interface Config {
  sanity: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    token?: string;
    useCdn: boolean;
  };
  api: {
    itemsPerPage: any;
    maxSearchResults: any;
    baseUrl: string;
    timeout: number;
  };
}

// Validate environment variables
function validateEnvVar(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Constants
export const ITEMS_PER_PAGE = 12;
export const MAX_SEARCH_RESULTS = 50;
export const IMAGE_QUALITY = 90;

// Configuration object with validation
export const config: Config = {
  sanity: {
    projectId: validateEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-18',
    token: process.env.SANITY_API_TOKEN,
    useCdn: process.env.NODE_ENV === 'production',
  },
  api: {
    baseUrl: validateEnvVar('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    itemsPerPage: ITEMS_PER_PAGE,
    maxSearchResults: MAX_SEARCH_RESULTS,
  },
};

// Feature flags
export const FEATURES = {
  enableSearch: true,
  enableCart: true,
  enableWishlist: false,
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data. Please try again later.',
  INVALID_ID: 'Invalid ID provided',
  NOT_FOUND: 'Item not found',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  products: 60 * 5, // 5 minutes
  categories: 60 * 60, // 1 hour
  static: 60 * 60 * 24, // 24 hours
};

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Admin email for restricting admin access
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

// OAuth configuration
export const GOOGLE_OAUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback` : 'http://localhost:3000/api/auth/google/callback';

// Auth configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const TOKEN_EXPIRY = '7d'; // Token expiry time 