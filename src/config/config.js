// Centralized configuration for the application
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If imagePath already includes http/https, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${imagePath}`;
};
