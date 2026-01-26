import sql from './db.js';
import { getApiUrl } from '../src/config';

// ============== LOCAL STORAGE CACHE ==============
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const MAX_CACHE_SIZE = 500000; // ~500KB max per item to avoid quota issues

const cacheGet = (key) => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const cacheSet = (key, data) => {
    try {
        const jsonStr = JSON.stringify({ data, timestamp: Date.now() });
        // Skip if data is too large (likely contains base64 images)
        if (jsonStr.length > MAX_CACHE_SIZE) {
            console.log('Skipping cache for large data:', key, `(${(jsonStr.length / 1024).toFixed(1)}KB)`);
            return;
        }
        localStorage.setItem(key, jsonStr);
    } catch (e) {
        // Quota exceeded - clear old property caches and try again
        console.warn('Cache quota exceeded, clearing old caches...');
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('property') || k.startsWith('properties')) {
                    localStorage.removeItem(k);
                }
            });
        } catch { }
    }
};

const cacheInvalidate = (keyPrefix) => {
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(keyPrefix)) localStorage.removeItem(key);
        });
    } catch { }
};

// Helper to normalize image data
const normalizeImages = (images) => {
    const rawImages = (() => {
        if (!images) return [];
        if (Array.isArray(images)) return images;

        if (typeof images === 'string') {
            // Check for Postgres array format {img1,img2}
            if (images.startsWith('{') && images.endsWith('}')) {
                const content = images.substring(1, images.length - 1);
                if (!content) return [];
                // Simple comma split for now (safe enough for filenames)
                return content.split(',').map(s => s.replace(/"/g, '').trim());
            }

            if (images.includes(',')) {
                return images.split(',').map(i => i.trim());
            }
            return [images];
        }
        return [];
    })();

    // Prepend Backend URL if needed
    return rawImages.map(img => {
        if (!img) return '';
        if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) return img;
        // If it looks like a relative path (starts with / or just filename), prepend API URL
        // Remove leading slash to avoid double slash if getApiUrl adds one?
        // getApiUrl usually returns base, we need to ensure correct join.
        // Assuming getApiUrl returns "http://localhost:8080"
        return getApiUrl(img.startsWith('/') ? img : `/${img}`);
    });
};

// Normalize property fields from backend to frontend expected format
const normalizeProperty = (p) => ({
    ...p,
    // Image normalization
    images: normalizeImages(p.images || p.imageUrls),
    // Panorama field normalization (backend sends camelCase, frontend uses snake_case)
    panorama_image_path: p.panorama_image_path || p.panoramaImagePath || '',
    panorama_images: p.panorama_images || p.panoramaImages || [],
    // Price field normalization
    rent: p.rent || p.rentAmount || p.rent_amount,
    // Other field normalizations
    name: p.name || p.title,
    locality: p.locality || p.area,
    availability: p.availability || p.availabilityStatus,
    type: p.type || p.propertyType || p.property_type,
    possession: p.possession || p.possessionYear,
    construction_status: p.construction_status || p.constructionStatus,
    brochure_url: p.brochure_url || p.brochureUrl,
    google_map_link: p.google_map_link || p.googleMapLink,
    virtual_tour_link: p.virtual_tour_link || p.virtualTourLink,
    builder_name: p.builder_name || p.builderName
});

// ============== PROPERTY OPERATIONS ==============

// Upload Legal Document (PDF)
export async function uploadLegalDocument(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(getApiUrl('/api/properties/upload-legal-doc'), {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const fileName = await response.text();
        return { success: true, data: fileName };
    } catch (error) {
        console.error('Error uploading legal document:', error);
        return { success: false, error: error.message };
    }
}

// Upload Panorama Image (360)
// Upload Panorama Images (Multi-360)
export async function uploadPanoramaImages(files) {
    try {
        const formData = new FormData();
        // Append each file with the same key "files" which Spring Boot expects for List<MultipartFile>
        if (files && files.length > 0) {
            Array.from(files).forEach((file) => {
                formData.append('files', file);
            });
        } else {
            return { success: true, data: [] };
        }

        const response = await fetch(getApiUrl('/api/properties/upload-panorama'), {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        // response is a list of file URLs
        const fileUrls = await response.json();
        return { success: true, data: fileUrls };
    } catch (error) {
        console.error('Error uploading panoramas:', error);
        return { success: false, error: error.message };
    }
}

// Verify Property (Admin)
export async function verifyProperty(propertyId, isVerified, userId) {
    try {
        const response = await fetch(getApiUrl(`/api/properties/${propertyId}/verify?isVerified=${isVerified}&userId=${userId}`), {
            method: 'PATCH'
        });

        if (!response.ok) {
            throw new Error('Verification failed');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error verifying property:', error);
        return { success: false, error: error.message };
    }
}

// Payment API
export async function createPaymentOrder(userId, propertyId) {
    try {
        const response = await fetch(getApiUrl('/api/payments/create-order'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, propertyId })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to create order');
        }
        return await response.json();
    } catch (error) {
        console.error('Create Order Error:', error);
        return { error: error.message };
    }
}

export async function verifyPayment(paymentData) {
    try {
        const response = await fetch(getApiUrl('/api/payments/verify-payment'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Payment verification failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Verify Payment Error:', error);
        return { error: error.message };
    }
}

export async function checkBookingStatus(userId, propertyId) {
    try {
        const response = await fetch(getApiUrl(`/api/payments/check-booking?userId=${userId}&propertyId=${propertyId}`));
        if (!response.ok) return { isBooked: false };
        return await response.json();
    } catch (error) {
        console.error('Check Booking Error:', error);
        return { isBooked: false };
    }
}

export async function getUserPayments(userId) {
    try {
        const response = await fetch(getApiUrl(`/api/payments/user/${userId}`));
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Get User Payments Error:', error);
        return [];
    }
}

export async function getBuilderPayments(builderId) {
    try {
        const results = await sql`
            SELECT p.*, pr.title as property_name, u.full_name as user_name, u.email as user_email
            FROM payments p
            LEFT JOIN properties pr ON p.property_id = pr.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.builder_id = ${builderId}
            ORDER BY p.created_at DESC
        `;
        return results;
    } catch (error) {
        console.error('Error fetching builder payments:', error);
        return [];
    }
}

// Get all properties (with optional filters)
export async function getProperties(filters = {}) {
    const cacheKey = `properties_${JSON.stringify(filters)}`;

    // Check cache first (only for no filters - list page)
    if (!Object.keys(filters).length) {
        const cached = cacheGet(cacheKey);
        if (cached) {
            console.log('Using cached properties');
            return { success: true, data: cached, fromCache: true };
        }
    }

    try {
        // Build query params from filters
        const params = new URLSearchParams();
        if (filters.purpose) params.append('purpose', filters.purpose.toUpperCase());
        if (filters.type) params.append('propertyType', filters.type.toUpperCase());
        if (filters.city) params.append('city', filters.city);
        if (filters.locality) params.append('area', filters.locality);

        const queryString = params.toString();
        const url = getApiUrl(queryString ? `/api/properties/search?${queryString}` : '/api/properties');

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch properties: ${response.status}`);
        }

        const data = await response.json();
        const processed = (Array.isArray(data) ? data : []).map(normalizeProperty);

        // Cache the results
        if (!Object.keys(filters).length) {
            cacheSet(cacheKey, processed);
        }

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { success: false, error: 'Backend not available. Please ensure the server is running.', data: [] };
    }
}

// Get property by ID
export async function getPropertyById(id) {
    const cacheKey = `property_${id}`;

    // Check cache first
    const cached = cacheGet(cacheKey);
    if (cached) {
        console.log('Using cached property:', id);
        return { success: true, data: cached, fromCache: true };
    }

    try {
        const response = await fetch(getApiUrl(`/api/properties/${id}`));

        if (!response.ok) {
            if (response.status === 404) {
                return { success: false, error: 'Property not found' };
            }
            throw new Error(`Failed to fetch property: ${response.status}`);
        }

        const property = await response.json();
        const processed = normalizeProperty(property);

        // Cache the result
        cacheSet(cacheKey, processed);

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching property:', error);
        return { success: false, error: 'Backend not available. Please ensure the server is running.' };
    }
}

// Get properties by builder (uses user ID, backend maps to builder via email)
// Get properties by builder (Direct SQL for performance)
export async function getPropertiesByBuilder(userId) {
    try {
        // Direct SQL query instead of fetch
        const results = await sql`
            SELECT * FROM properties 
            WHERE builder_id = ${userId} 
            ORDER BY created_at DESC
        `;

        // Normalize results to match frontend expectations
        const processed = results.map(normalizeProperty);
        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching builder properties:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Get nearby properties based on user location
export async function getNearbyProperties(lat, lng, radiusKm = 10) {
    try {
        const results = await sql`
            SELECT p.*, p.title as name, p.property_type as type, p.rent_amount as rent, 
                   p.area_sqft as area, p.area as locality, p.possession_year as possession, 
                   p.availability_status as availability, u.full_name as builder_name, u.email as builder_email
            FROM properties p
            LEFT JOIN users u ON p.builder_id = u.id
            WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
            ORDER BY p.created_at DESC
        `;

        // Filter by distance and add distance property
        const nearbyProperties = results
            .map(p => ({
                ...p,
                images: normalizeImages(p.images),
                distance: calculateDistance(lat, lng, p.latitude, p.longitude)
            }))
            .filter(p => p.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        return { success: true, data: nearbyProperties };
    } catch (error) {
        console.error('Error fetching nearby properties:', error);
        return { success: false, error: error.message };
    }
}

// Create a new property
export async function createProperty(propertyData) {
    try {
        const {
            builderId, name, type, purpose, price, rent, area,
            city, locality, latitude, longitude, mapLink, possession, constructionStatus, description,
            bedrooms, bathrooms, amenities, images, availability,
            brochureUrl, googleMapLink, virtualTourLink,
            legalDocumentPath, panoramaImagePath, panoramaImages
        } = propertyData;

        // Process amenities - convert comma-separated string to array
        const amenitiesArray = amenities
            ? (typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()) : amenities)
            : [];

        // Process numeric fields
        const parsedPossession = parseInt(possession, 10);
        const possessionYear = !isNaN(parsedPossession) ? parsedPossession : null;

        // Map frontend property type to database enum values (RESIDENTIAL or COMMERCIAL)
        const mapPropertyType = (ptype) => {
            if (!ptype) return 'RESIDENTIAL';
            const commercialTypes = ['commercial', 'office', 'industrial', 'warehouse'];
            return commercialTypes.includes(ptype.toLowerCase()) ? 'COMMERCIAL' : 'RESIDENTIAL';
        };
        const dbPropertyType = mapPropertyType(type);

        // Map frontend purpose to database enum values (BUY or RENT)
        const dbPurpose = purpose ? purpose.toUpperCase() : 'BUY';

        // Map frontend construction status to database enum values
        const mapConstructionStatus = (status) => {
            if (!status) return 'READY';
            const statusMap = {
                'completed': 'READY',
                'ready': 'READY',
                'under construction': 'UNDER_CONSTRUCTION',
                'new launch': 'UNDER_CONSTRUCTION'
            };
            return statusMap[status.toLowerCase()] || 'READY';
        };
        const dbConstructionStatus = mapConstructionStatus(constructionStatus);

        // Process images - ensure it's an array
        const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);

        // Build property object for backend API
        const propertyPayload = {
            title: name,
            propertyType: dbPropertyType,
            purpose: dbPurpose,
            price: price ? parseFloat(price) : null,
            rentAmount: rent ? parseFloat(rent) : null,
            areaSqft: area ? parseInt(area, 10) : null,
            city: city || '',
            area: locality || '',
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            possessionYear: possessionYear,
            constructionStatus: dbConstructionStatus,
            description: description || '',
            bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
            bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
            amenities: amenitiesArray,
            imageUrls: imagesArray,
            availabilityStatus: (availability || 'AVAILABLE').toUpperCase(),
            brochureUrl: brochureUrl || null,
            googleMapLink: googleMapLink || mapLink || null,
            virtualTourLink: virtualTourLink || null,
            legalDocumentPath: legalDocumentPath || null,
            panoramaImagePath: panoramaImagePath || null,
            panoramaImages: panoramaImages || [],
            isVerified: false
        };

        const response = await fetch(getApiUrl(`/api/properties/builder/${builderId}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create property: ${errorText}`);
        }

        const result = await response.json();
        // Invalidate property list cache so new property shows up
        cacheInvalidate('properties');

        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating property:', error);
        return { success: false, error: error.message };
    }
}

// Update property
export async function updateProperty(propertyId, updates) {
    try {
        // Process amenities - convert comma-separated string to array if needed
        const amenitiesArray = updates.amenities
            ? (typeof updates.amenities === 'string' ? updates.amenities.split(',').map(a => a.trim()) : updates.amenities)
            : undefined;

        // Process images - ensure it's an array if provided
        const imagesArray = updates.images
            ? (Array.isArray(updates.images) ? updates.images : [updates.images])
            : undefined;

        // Build update payload for backend API
        const updatePayload = {
            title: updates.name || undefined,
            propertyType: updates.type ? updates.type.toUpperCase() : undefined,
            purpose: updates.purpose ? updates.purpose.toUpperCase() : undefined,
            price: updates.price ? parseFloat(updates.price) : undefined,
            rentAmount: updates.rent ? parseFloat(updates.rent) : undefined,
            areaSqft: updates.area ? parseInt(updates.area, 10) : undefined,
            city: updates.city || undefined,
            area: updates.locality || undefined,
            possessionYear: updates.possession ? parseInt(updates.possession, 10) : undefined,
            constructionStatus: updates.constructionStatus || undefined,
            description: updates.description || undefined,
            bedrooms: updates.bedrooms ? parseInt(updates.bedrooms, 10) : undefined,
            bathrooms: updates.bathrooms ? parseInt(updates.bathrooms, 10) : undefined,
            amenities: amenitiesArray,
            imageUrls: imagesArray,
            availabilityStatus: updates.availability || undefined,
            latitude: updates.latitude ? parseFloat(updates.latitude) : undefined,
            longitude: updates.longitude ? parseFloat(updates.longitude) : undefined,
            brochureUrl: updates.brochureUrl || undefined,
            googleMapLink: updates.googleMapLink || updates.mapLink || undefined,
            googleMapLink: updates.googleMapLink || updates.mapLink || undefined,
            virtualTourLink: updates.virtualTourLink || undefined,
            panoramaImages: updates.panoramaImages || undefined
        };

        // Remove undefined values
        Object.keys(updatePayload).forEach(key =>
            updatePayload[key] === undefined && delete updatePayload[key]
        );

        const response = await fetch(getApiUrl(`/api/properties/${propertyId}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update property: ${errorText}`);
        }

        const result = await response.json();

        // Invalidate specific property cache and list cache
        cacheInvalidate(`property_${propertyId}`);
        cacheInvalidate('properties');

        return { success: true, data: result };
    } catch (error) {
        console.error('Error updating property:', error);
        return { success: false, error: error.message };
    }
}

// Delete property
export async function deleteProperty(propertyId) {
    try {
        await sql`DELETE FROM properties WHERE id = ${propertyId}`;

        // Invalidate caches
        cacheInvalidate(`property_${propertyId}`);
        cacheInvalidate('properties');

        return { success: true };
    } catch (error) {
        console.error('Error deleting property:', error);
        return { success: false, error: error.message };
    }
}

// ============== ENQUIRY OPERATIONS ==============

// Get enquiries for a user
export async function getUserEnquiries(userId) {
    try {
        const results = await sql`
      SELECT e.*, p.title as property_name, p.city, p.area as locality
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      WHERE e.user_id = ${userId}
      ORDER BY e.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching user enquiries:', error);
        return { success: false, error: error.message };
    }
}

// Get enquiries for a builder
export async function getBuilderEnquiries(builderId) {
    try {
        const results = await sql`
      SELECT e.*, p.title as property_name, e.name as customer_name, e.email as customer_email
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      WHERE e.builder_id = ${builderId}
      ORDER BY e.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching builder enquiries:', error);
        return { success: false, error: error.message };
    }
}

// Create enquiry
export async function createEnquiry(enquiryData) {
    try {
        const { propertyId, userId, builderId, fullName, email, phone, message, enquiryType } = enquiryData;

        const result = await sql`
      INSERT INTO enquiries (property_id, builder_id, name, email, phone, message, enquiry_type)
      VALUES (${propertyId}, ${builderId}, ${fullName}, ${email}, ${phone}, ${message}, ${enquiryType || 'buy'})
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating enquiry:', error);
        return { success: false, error: error.message };
    }
}

// Update enquiry status
export async function updateEnquiryStatus(enquiryId, status) {
    try {
        const result = await sql`
      UPDATE enquiries
      SET status = ${status}
      WHERE id = ${enquiryId}
    RETURNING *
        `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating enquiry:', error);
        return { success: false, error: error.message };
    }
}

// Create a new rent request
export async function createRentRequest(requestData) {
    try {
        const { propertyId, userId, builderId, moveInDate, message } = requestData;
        const result = await sql`
      INSERT INTO rent_requests(property_id, builder_id, move_in_date, status, applicant_name, email, phone)
    VALUES(${propertyId}, ${builderId}, ${moveInDate}, 'pending', 'Unknown', 'Unknown', '0000000000')
    RETURNING *
        `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating rent request:', error);
        return { success: false, error: error.message };
    }
}


// Update rent request status
export async function updateRentRequestStatus(requestId, status) {
    try {
        const result = await sql`
      UPDATE rent_requests
      SET status = ${status}
      WHERE id = ${requestId}
      RETURNING *
    `;
        const updatedRequest = result[0];

        // If approved, create a rent subscription
        if (status === 'approved' && updatedRequest) {
            // Check if already exists?
            // For now, just insert.
            // Next payment due: same as move_in_date or today + 30?
            // Let's set next due date as move_in_date initially.
            await sql`
                    INSERT INTO rent_subscriptions (user_id, property_id, builder_id, rent_amount, next_payment_due, is_active)
                    VALUES (
                        ${updatedRequest.user_id}, 
                        ${updatedRequest.property_id}, 
                        ${updatedRequest.builder_id}, 
                        ${updatedRequest.rent_amount || 0}, 
                        ${updatedRequest.move_in_date || new Date()}, 
                        TRUE
                    )
                `;
        }

        return { success: true, data: updatedRequest };
    } catch (error) {
        console.error('Error updating rent request:', error);
        return { success: false, error: error.message };
    }
}

export async function payRent(subscriptionId, amount) {
    try {
        // Get subscription details
        const sub = await sql`SELECT * FROM rent_subscriptions WHERE id = ${subscriptionId}`;
        if (!sub || sub.length === 0) throw new Error('Subscription not found');

        const subscription = sub[0];

        // Record Payment
        await sql`
                INSERT INTO payments (user_id, property_id, builder_id, amount, status, transaction_id)
                VALUES (
                    ${subscription.user_id}, 
                    ${subscription.property_id}, 
                    ${subscription.builder_id}, 
                    ${amount}, 
                    'success', 
                    ${'TXN_' + Date.now()}
                )
            `;

        // Update Next Due Date (+30 days)
        const currentDue = new Date(subscription.next_payment_due);
        const nextDue = new Date(currentDue.setDate(currentDue.getDate() + 30));

        await sql`
                UPDATE rent_subscriptions
                SET next_payment_due = ${nextDue}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ${subscriptionId}
            `;

        return { success: true };
    } catch (error) {
        console.error('Error paying rent:', error);
        return { success: false, error: error.message };
    }
}

// ============== RENT REQUEST OPERATIONS ==============

export async function getRentRequestsByBuilder(builderId) {
    try {
        const results = await sql`
      SELECT r.*, p.title as property_name, r.applicant_name as customer_name
      FROM rent_requests r
      JOIN properties p ON r.property_id = p.id
      WHERE r.builder_id = ${builderId}
      ORDER BY r.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching rent requests:', error);
        return { success: false, error: error.message };
    }
}


// ============== ADMIN OPERATIONS ==============

// Get all builders (for admin)
export async function getAllBuilders() {
    try {
        const results = await sql`
      SELECT u.*,
    (SELECT COUNT(*) FROM properties WHERE builder_id = u.id) as property_count
      FROM users u
      WHERE u.role = 'builder'
      ORDER BY u.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching builders:', error);
        return { success: false, error: error.message };
    }
}

// Update builder status
export async function updateBuilderStatus(builderId, status) {
    try {
        const result = await sql`
      UPDATE users
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${builderId} AND role = 'builder'
      RETURNING id, username, email, full_name, status
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating builder status:', error);
        return { success: false, error: error.message };
    }
}

// Get all properties (for admin)
export async function getAllProperties() {
    try {
        const results = await sql`
      SELECT p.title as name, p.*, u.full_name as builder_name
      FROM properties p
      LEFT JOIN users u ON p.builder_id = u.id
      ORDER BY p.created_at DESC
    `;
        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));
        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching all properties:', error);
        return { success: false, error: error.message };
    }
}

// Update property status (admin)
export async function updatePropertyStatus(propertyId, status) {
    try {
        const result = await sql`
      UPDATE properties
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${propertyId}
RETURNING *, title as name
`;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating property status:', error);
        return { success: false, error: error.message };
    }
}

// Get all complaints
export async function getAllComplaints() {
    try {
        const results = await sql`
      SELECT c.*, p.title as property_name, u.full_name as complainant_name
      FROM complaints c
      LEFT JOIN properties p ON c.property_id = p.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return { success: false, error: error.message };
    }
}

// Update complaint status
export async function updateComplaintStatus(complaintId, status) {
    try {
        const result = await sql`
      UPDATE complaints
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${complaintId}
RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating complaint:', error);
        return { success: false, error: error.message };
    }
}

// Create complaint
export async function createComplaint(complaintData) {
    try {
        const { propertyId, userId, issue } = complaintData;
        const result = await sql`
      INSERT INTO complaints (property_id, user_id, issue, status)
      VALUES (${propertyId}, ${userId}, ${issue}, 'open')
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating complaint:', error);
        return { success: false, error: error.message };
    }
}

// ============== WISHLIST OPERATIONS ==============

export async function getUserWishlist(userId) {
    try {
        const results = await sql`
      SELECT p.*, p.title as name FROM wishlist w
      JOIN properties p ON w.property_id = p.id
      WHERE w.user_id = ${userId}
      ORDER BY w.created_at DESC
    `;
        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));
        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return { success: false, error: error.message };
    }
}

export async function addToWishlist(userId, propertyId) {
    try {
        const result = await sql`
      INSERT INTO wishlist(user_id, property_id)
VALUES(${userId}, ${propertyId})
      ON CONFLICT(user_id, property_id) DO NOTHING
RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, error: error.message };
    }
}

export async function removeFromWishlist(userId, propertyId) {
    try {
        const result = await sql`
      DELETE FROM wishlist
      WHERE user_id = ${userId} AND property_id = ${propertyId}
`;
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error: error.message };
    }
}

// ============== USER RENT HISTORY ==============

export async function getUserRentHistory(userId) {
    try {
        const results = await sql`
      SELECT r.*, p.title as property_name
      FROM rent_requests r
      JOIN properties p ON r.property_id = p.id
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching rent history:', error);
        return { success: false, error: error.message };
    }
}

// ============== PAYMENT OPERATIONS ==============
// Payment operations are handled via API routes (server-side only)
// Frontend should call /api/payments/* endpoints directly

/**
 * Frontend-safe payment helper - Get user payments via API
 */
export async function fetchUserPayments(userId) {
    try {
        const result = await sql`
            SELECT p.*,
    pr.title as property_name, pr.city, pr.images,
    u.full_name as builder_name
            FROM payments p
            LEFT JOIN properties pr ON p.property_id = pr.id
            LEFT JOIN users u ON p.builder_id = u.id
            WHERE p.user_id = ${userId}
            ORDER BY p.created_at DESC
    `;
        return { success: true, data: result };
    } catch (error) {
        console.error('Get user payments error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Frontend-safe rent subscriptions fetch
 */
export async function fetchUserRentSubscriptions(userId) {
    try {
        const result = await sql`
            SELECT rs.*,
    p.title as property_name, p.city, p.area, p.images,
    u.full_name as builder_name, u.phone as builder_phone
            FROM rent_subscriptions rs
            LEFT JOIN properties p ON rs.property_id = p.id
            LEFT JOIN users u ON rs.builder_id = u.id
            WHERE rs.user_id = ${userId}
            ORDER BY rs.is_active DESC, rs.next_payment_due ASC
    `;
        return { success: true, data: result };
    } catch (error) {
        console.error('Get user rent subscriptions error:', error);
        return { success: false, error: error.message };
    }
}

// ============== WITHDRAWAL OPERATIONS ==============

export async function createWithdrawalRequest(builderId, amount) {
    try {
        // Calculate commission (Simplified logic: taking flat 5% on withdrawal or assuming amount is pre-calc)
        // But requirement says: "admin approves it and then automatically the commission of admin should be minus"
        // So we record the FULL requested amount, and Admin logic handles the split?
        // Or Builder requests "Available Balance".

        // Let's assume Builder requests X. Admin takes Y% cut.
        // Commission logic: 5% for Buy, 2.5% for Rent. 
        // Ideally commission is per transaction. If we aggregate, we might need average or just apply a flat rate?
        // BETTER: We track commission at PAYMENT time if possible. But we don't have that yet.
        // WORKAROUND: We apply a standard Service Fee or assume 'amount' is what Builder expects, and Admin marks it up?
        // User Request: "admin approves it and then automatically the commission of admin should be minus"
        // Implies: Withdrawal Amount = (Total Collected) - (Commission).
        // So when creating request, we might just Request Everything.

        // For MVP: Let's store just the Amount. Admin dashboard will calc and update.

        const result = await sql`
                INSERT INTO withdrawals (builder_id, amount, commission_amount, payout_amount, status)
                VALUES (${builderId}, ${amount}, 0, 0, 'pending')
                RETURNING *
            `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        return { success: false, error: error.message };
    }
}

export async function getBuilderWithdrawals(builderId) {
    try {
        // also get total collected payments to show balance
        const payments = await sql`SELECT SUM(amount) as total FROM payments WHERE builder_id = ${builderId}`;
        const withdrawals = await sql`
                SELECT * FROM withdrawals WHERE builder_id = ${builderId} ORDER BY created_at DESC
             `;
        const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved')
            .reduce((sum, w) => sum + parseFloat(w.payout_amount || 0), 0);

        const totalEarned = parseFloat(payments[0].total || 0);
        const balance = totalEarned - approvedWithdrawals; // Rough estimate of what's left "in system"

        // Wait, withdrawals deduct from balance.
        // If I requested 1000, and Admin took 50 commission, gave me 950.
        // Did I withdraw 1000 or 950 from my "Balance"?
        // Usually Balance reduces by the Gross Amount (1000).
        // So Approved Withdrawals should sum 'amount' (Gross) not 'payout_amount' (Net)
        // But if specific requirement says "commission minus", maybe Balance is Gross.

        const totalWithdrawnGross = withdrawals.filter(w => w.status === 'approved')
            .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

        return { success: true, data: withdrawals, balance: totalEarned - totalWithdrawnGross, totalEarned };
    } catch (error) {
        console.error('Error fetching builder withdrawals:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdminWithdrawals() {
    try {
        const result = await sql`
                SELECT w.*, u.full_name as builder_name, u.email as builder_email 
                FROM withdrawals w
                JOIN users u ON w.builder_id = u.id
                ORDER BY w.created_at DESC
            `;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching admin withdrawals:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdminPayments() {
    try {
        const result = await sql`
                SELECT p.*, pr.title as property_name, u.full_name as builder_name, b.full_name as user_name
                FROM payments p
                LEFT JOIN properties pr ON p.property_id = pr.id
                LEFT JOIN users u ON p.builder_id = u.id
                LEFT JOIN users b ON p.user_id = b.id
                ORDER BY p.created_at DESC
             `;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching admin payments:', error);
        return { success: false, error: error.message };
    }
}

export async function updateWithdrawalStatus(withdrawalId, status, commissionAmount, payoutAmount) {
    try {
        const result = await sql`
                UPDATE withdrawals
                SET status = ${status}, 
                    commission_amount = ${commissionAmount || 0}, 
                    payout_amount = ${payoutAmount || 0},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${withdrawalId}
                RETURNING *
            `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating withdrawal:', error);
        return { success: false, error: error.message };
    }
}
