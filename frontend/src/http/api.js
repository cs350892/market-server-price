import axios from "axios";
// Determine base URL for API
let baseURL = import.meta.env.VITE_API_URL;
// Fallback logic for safety (should not be needed if .env files are set)
if (!baseURL) {
    if (import.meta.env.MODE === 'development') {
        baseURL = 'http://localhost:5000/api/v1';
    } else {
        baseURL = 'https://<MY-RENDER-DOMAIN>.onrender.com/api/v1';
    }
}
const api = axios.create({
        baseURL,
        headers: {
                'Content-Type': 'application/json'
        }
});
// Create new product (matching new backend structure)
export const createNewProduct = async (data) => {
    return api.post('/api/v1/products/create', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Fetch single product (matching new backend route)
export const fetchSingleNewProduct = async (id) => {
    return api.get(`/api/v1/products/details/${id}`)
}

// Update product (matching new backend route)
export const updateNewProduct = async (id, data) => {
    console.log("product id:", id)
    console.log("FormData:", data)
    return api.patch(`/api/v1/products/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Delete product (matching new backend route)
export const deleteNewProduct = async (id) => {
    return api.delete(`/api/v1/products/delete/${id}`)
}

// Get all products with pagination (new backend route)
export const fetchNewProductsWithLimit = async (limit = 10, skip = 0) => {
    return api.get('/api/v1/products/list', {
        params: { limit, skip }
    })
}

// Get products by category with limit (new backend route)
/**
 * data: { 
    limit: number, 
    skip: number, 
    category: string[]
}
 */
export const fetchNewProductByCategoryWithLimit = async (data) => {
    return api.post('/api/v1/products/by-category-limit', data)
}

// Get all categories (new backend route)
export const fetchAllNewProductCategory = async () => {
    return api.get('/api/v1/products/categories')
}

// Search products
export const searchNewProducts = async (query, limit = 10, skip = 0) => {
    return api.get('/api/v1/products/search', {
        params: { query, limit, skip }
    })
}

// Get products by brand
export const fetchProductsByBrand = async (brand) => {
    return api.get(`/api/v1/products/brand/${brand}`)
}

// Get low stock products
export const fetchLowStockProducts = async (threshold = 20) => {
    return api.get('/api/v1/products/stock/low', {
        params: { threshold }
    })
}

// Get out of stock products
export const fetchOutOfStockProducts = async () => {
    return api.get('/api/v1/products/stock/out')
}

// Get price for quantity
export const getPriceForQuantity = async (productId, quantity ) => {
    return api.post(`/api/v1/products/price/${productId}`, { quantity })
}