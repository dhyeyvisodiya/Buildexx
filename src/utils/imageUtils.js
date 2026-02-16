import { getApiUrl } from '../config';

/**
 * Ensures an image URL is correctly formatted for display.
 * If it's a relative path (e.g. starting with /uploads/), it prepends the API URL.
 * Handles both single string URLs and arrays.
 */
export const getImageUrl = (url) => {
    if (!url) return null;

    // If it's an array, take the first one
    const targetUrl = Array.isArray(url) ? url[0] : url;

    if (!targetUrl) return null;

    // If it's already a full URL or base64, return it
    if (targetUrl.startsWith('http') || targetUrl.startsWith('data:')) {
        // Optimization for Cloudinary URLs: apply auto format and quality
        if (targetUrl.includes('cloudinary.com') && targetUrl.includes('/upload/')) {
            return targetUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return targetUrl;
    }

    const baseUrl = getApiUrl('');
    // Ensure we don't have double slashes
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanUrl = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;

    return `${cleanBaseUrl}${cleanUrl}`;
};

/**
 * Returns an array of formatted image URLs.
 */
export const getImagesUrls = (images) => {
    if (!images || !Array.isArray(images)) return [];
    return images.map(img => getImageUrl(img)).filter(Boolean);
};
