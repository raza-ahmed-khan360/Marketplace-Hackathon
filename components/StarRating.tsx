'use client';

/**
 * Props interface for the StarRating component
 * @property {number} value - The rating value (number of filled stars)
 * @property {number} [max=5] - Maximum number of stars to display
 */
interface StarRatingProps {
  value: number;
  max?: number;
}

/**
 * StarRating Component
 * Displays a row of stars with a specified number filled based on the rating value
 * 
 * @param {StarRatingProps} props - Component props
 * @returns {JSX.Element} A row of star icons representing the rating
 */
export default function StarRating({ value, max = 5 }: StarRatingProps) {
  return (
    <div className="flex">
      {/* Generate an array of length 'max' and map through it to create stars */}
      {[...Array(max)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            // Apply yellow color to stars up to the rating value, gray for the rest
            index < value ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* SVG path for star shape */}
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
} 