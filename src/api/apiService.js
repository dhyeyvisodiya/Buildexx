import { getApiUrl } from '../config';

const API_URL = getApiUrl();

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic helper for responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    } else {
        // If response is text (like "Property Deleted Successfully")
        const text = await response.text();
        return { success: true, message: text };
    }
};

// --- Properties ---

export const getProperties = async () => {
    try {
        const response = await fetch(`${API_URL}/properties`);
        const data = await handleResponse(response);
        return { success: true, data: data.content || data }; // Handle Page or List
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { success: false, error: error.message };
    }
};

export const getPropertyById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


export const getPropertiesByBuilder = async (builderId) => {
    try {
        const response = await fetch(`${API_URL}/properties/builder/${builderId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const createProperty = async (propertyData) => {
    try {
        const response = await fetch(`${API_URL}/properties`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(propertyData)
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateProperty = async (id, propertyData) => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            method: 'PUT', // or PATCH
            headers: getHeaders(),
            body: JSON.stringify(propertyData)
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteProperty = async (id) => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response); // Ensure we catch errors
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updatePropertyAvailability = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}/availability?status=${status}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getCities = async () => {
    try {
        const response = await fetch(`${API_URL}/properties/cities`);
        const data = await handleResponse(response);
        return data; // Returns array directly usually
    } catch (error) {
        console.error("Error fetching cities", error);
        return [];
    }
};


export const getNearbyProperties = async (lat, lng, radius) => {
    try {
        const response = await fetch(`${API_URL}/properties/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


// --- Enquiries ---

export const getBuilderEnquiries = async (builderId) => {
    try {
        const response = await fetch(`${API_URL}/enquiries/builder/${builderId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateEnquiryStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/enquiries/${id}/status?status=${status}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// --- Rent Requests ---

export const getRentRequestsByBuilder = async (builderId) => {
    try {
        // Assuming endpoint exists
        const response = await fetch(`${API_URL}/rent-requests/builder/${builderId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateRentRequestStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_URL}/rent-requests/${id}/status?status=${status}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// --- Payments / Withdrawals ---

export const getBuilderPayments = async (builderId) => {
    try {
        const response = await fetch(`${API_URL}/payments/builder/${builderId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data }; // might be pure array or object
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getBuilderWithdrawals = async (builderId) => {
    try {
        const response = await fetch(`${API_URL}/withdrawals/builder/${builderId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const createWithdrawalRequest = async (builderId, amount) => {
    try {
        const response = await fetch(`${API_URL}/withdrawals`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ builderId, amount })
        });
        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


// --- Uploads ---

export const uploadLegalDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/properties/upload/document`, {
            method: 'POST',
            headers: getAuthHeaders(), // No Content-Type for FormData
            body: formData
        });
        const data = await response.text(); // Returns URL string
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const uploadPanoramaImages = async (files) => {
    try {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`${API_URL}/properties/upload/panorama`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await handleResponse(response);
        return { success: true, data }; // Returns List of URLs
    } catch (error) {
        return { success: false, error: error.message };
    }
};
