import sql from './db.js';

// Helper to normalize image data
const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;

    if (typeof images === 'string') {
        // Check for Postgres array format {img1,img2}
        if (images.startsWith('{') && images.endsWith('}')) {
            // Remove braces
            const content = images.substring(1, images.length - 1);
            if (!content) return [];

            // Complex parsing to handle quotes and possible commas in data
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < content.length; i++) {
                const char = content[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);

            // Clean up quotes
            return result.map(s => {
                s = s.trim();
                // If it was quoted, remove quotes and unescape double-quotes
                if (s.startsWith('"') && s.endsWith('"')) {
                    return s.substring(1, s.length - 1).replace(/""/g, '"');
                }
                return s;
            });
        }

        if (images.includes(',')) {
            if (images.trim().startsWith('data:')) {
                if (images.indexOf('data:', 5) > -1) {
                    return images.split(/,(?=data:)/).map(i => i.trim());
                }
                return [images]; // Single data URL
            }
            return images.split(',').map(i => i.trim());
        }
        return [images];
    }
    return [];
};

// ============== PROPERTY OPERATIONS ==============

// Upload Legal Document (PDF)
export async function uploadLegalDocument(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8081/api/properties/upload-legal-doc', {
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

        const response = await fetch('http://localhost:8081/api/properties/upload-panorama', {
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
        const response = await fetch(`http://localhost:8081/api/properties/${propertyId}/verify?isVerified=${isVerified}&userId=${userId}`, {
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

// Get all properties (with optional filters)
export async function getProperties(filters = {}) {
    try {
        let query = sql`
      SELECT p.*, p.title as name, p.property_type as type, p.rent_amount as rent, p.area_sqft as area, p.area as locality, p.possession_year as possession, p.availability_status as availability, 
             p.legal_document_path, p.is_verified, p.panorama_image_path,
             u.full_name as builder_name, u.email as builder_email
      FROM properties p
      LEFT JOIN users u ON p.builder_id = u.id
      ORDER BY p.created_at DESC
    `;

        const results = await query;

        // Apply filters in JS (since template literals don't support dynamic WHERE)
        let filtered = results;

        if (filters.type) {
            filtered = filtered.filter(p => p.property_type === filters.type);
        }
        if (filters.purpose) {
            filtered = filtered.filter(p => p.purpose === filters.purpose);
        }
        if (filters.city) {
            filtered = filtered.filter(p => p.city === filters.city);
        }
        if (filters.locality) {
            // Mapping check: Java schema uses 'area' for locality, Node used 'locality'
            filtered = filtered.filter(p => p.locality === filters.locality);
        }

        // Normalize images
        const processed = filtered.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { success: false, error: error.message };
    }
}

// Get property by ID
export async function getPropertyById(id) {
    try {
        const results = await sql`
            SELECT p.*, p.title as name, p.property_type as type, p.rent_amount as rent, p.area_sqft as area, p.area as locality, p.possession_year as possession, p.availability_status as availability, 
                   p.legal_document_path, p.is_verified, p.panorama_image_path, p.panorama_images,
                   u.full_name as builder_name, u.email as builder_email
            FROM properties p
            LEFT JOIN users u ON p.builder_id = u.id
            WHERE p.id = ${id}
        `;
        if (results.length === 0) return { success: false, error: 'Property not found' };

        const property = {
            ...results[0],
            images: normalizeImages(results[0].images)
        };
        return { success: true, data: property };
    } catch (error) {
        console.error('Error fetching property:', error);
        return { success: false, error: error.message };
    }
}

// Get properties by builder
export async function getPropertiesByBuilder(builderId) {
    try {
        const results = await sql`
      SELECT *, title as name, property_type as type, rent_amount as rent, area_sqft as area, area as locality, possession_year as possession, availability_status as availability FROM properties 
      WHERE builder_id = ${builderId}
      ORDER BY created_at DESC
    `;

        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching builder properties:', error);
        return { success: false, error: error.message };
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
            legalDocumentPath, panoramaImagePath
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
            if (!ptype) return null;
            const commercialTypes = ['commercial', 'office', 'industrial', 'warehouse'];
            return commercialTypes.includes(ptype.toLowerCase()) ? 'COMMERCIAL' : 'RESIDENTIAL';
        };
        const dbPropertyType = mapPropertyType(type);

        // Map frontend purpose to database enum values (BUY or RENT)
        const dbPurpose = purpose ? purpose.toUpperCase() : null;

        // Map frontend construction status to database enum values
        const mapConstructionStatus = (status) => {
            if (!status) return null;
            const statusMap = {
                'completed': 'READY',
                'ready': 'READY',
                'under construction': 'UNDER_CONSTRUCTION',
                'new launch': 'UNDER_CONSTRUCTION'
            };
            return statusMap[status.toLowerCase()] || null;
        };
        const dbConstructionStatus = mapConstructionStatus(constructionStatus);


        // Process images - ensure it's an array
        const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);

        const result = await sql`
      INSERT INTO properties (
        builder_id, title, property_type, purpose, price, rent_amount, area_sqft,
        city, area, latitude, longitude, possession_year, construction_status, description,
        bedrooms, bathrooms, amenities, images,
        availability_status,
        brochure_url, google_map_link, virtual_tour_link,
        legal_document_path, panorama_image_path, panorama_images, is_verified
      )
      VALUES (
        ${builderId}, ${name}, ${dbPropertyType}, ${dbPurpose}, ${price || null}, ${rent || null},
        ${area || null}, ${city || null}, ${locality || null}, ${latitude || null}, ${longitude || null}, ${possessionYear}, 
        ${dbConstructionStatus}, ${description || null},
        ${bedrooms || null}, ${bathrooms || null}, ${amenitiesArray}, ${imagesArray},
            ${(availability || 'AVAILABLE').toUpperCase()},
        ${brochureUrl || null}, ${googleMapLink || mapLink || null}, ${virtualTourLink || null},
        ${legalDocumentPath || null}, ${panoramaImagePath || null}, ${propertyData.panoramaImages || []}, false
      )
      RETURNING *, title as name, property_type as type, rent_amount as rent, area_sqft as area, area as locality, possession_year as possession, availability_status as availability
    `;
        return { success: true, data: result[0] };
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
            : null;

        // Process images - ensure it's an array if provided
        const imagesArray = updates.images
            ? (Array.isArray(updates.images) ? updates.images : [updates.images])
            : null;

        const result = await sql`
      UPDATE properties
      SET 
        title = COALESCE(${updates.name || null}, title),
        property_type = COALESCE(${updates.type || null}, property_type),
        purpose = COALESCE(${updates.purpose || null}, purpose),
        price = COALESCE(${updates.price || null}, price),
        rent_amount = COALESCE(${updates.rent || null}, rent_amount),
        area_sqft = COALESCE(${updates.area || null}, area_sqft),
        city = COALESCE(${updates.city || null}, city),
        area = COALESCE(${updates.locality || null}, area),
        possession_year = COALESCE(${updates.possession || null}, possession_year),
        construction_status = COALESCE(${updates.constructionStatus || null}, construction_status),
        description = COALESCE(${updates.description || null}, description),
        bedrooms = COALESCE(${updates.bedrooms || null}, bedrooms),
        bathrooms = COALESCE(${updates.bathrooms || null}, bathrooms),
        amenities = COALESCE(${amenitiesArray}, amenities),
        images = COALESCE(${imagesArray}, images),
        availability_status = COALESCE(${updates.availability || null}, availability_status),
        latitude = COALESCE(${updates.latitude || null}, latitude),
        longitude = COALESCE(${updates.longitude || null}, longitude),
        brochure_url = COALESCE(${updates.brochureUrl || null}, brochure_url),
        google_map_link = COALESCE(${updates.googleMapLink || updates.mapLink || null}, google_map_link),
        virtual_tour_link = COALESCE(${updates.virtualTourLink || null}, virtual_tour_link),
        panorama_images = COALESCE(${updates.panoramaImages || null}, panorama_images),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${propertyId}
      RETURNING *, title as name, property_type as type, rent_amount as rent, area_sqft as area, area as locality, possession_year as possession, availability_status as availability
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating property:', error);
        return { success: false, error: error.message };
    }
}

// Delete property
export async function deleteProperty(propertyId) {
    try {
        await sql`DELETE FROM properties WHERE id = ${propertyId}`;
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
      SELECT e.*, p.title as property_name, u.full_name as customer_name, u.email as customer_email
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN users u ON e.user_id = u.id
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
      INSERT INTO enquiries (property_id, user_id, builder_id, full_name, email, phone, message, enquiry_type)
      VALUES (${propertyId}, ${userId || null}, ${builderId}, ${fullName}, ${email}, ${phone}, ${message}, ${enquiryType || 'buy'})
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
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
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
      INSERT INTO rent_requests (property_id, user_id, builder_id, move_in_date, status)
      VALUES (${propertyId}, ${userId || null}, ${builderId}, ${moveInDate}, 'pending')
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating rent request:', error);
        return { success: false, error: error.message };
    }
}

// ============== RENT REQUEST OPERATIONS ==============

export async function getRentRequestsByBuilder(builderId) {
    try {
        const results = await sql`
      SELECT r.*, p.title as property_name, u.full_name as customer_name
      FROM rent_requests r
      JOIN properties p ON r.property_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.builder_id = ${builderId}
      ORDER BY r.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching rent requests:', error);
        return { success: false, error: error.message };
    }
}

export async function updateRentRequestStatus(requestId, status) {
    try {
        const result = await sql`
      UPDATE rent_requests
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${requestId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating rent request:', error);
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
      INSERT INTO wishlist (user_id, property_id)
      VALUES (${userId}, ${propertyId})
      ON CONFLICT (user_id, property_id) DO NOTHING
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
