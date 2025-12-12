import axios from "axios";
// Determine base URL for API
const baseURL = import.meta.env.VITE_URL_API;
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Create new product
export const createNewProduct = async (data) => {
    return api.post('/product', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Fetch single product
export const fetchSingleNewProduct = async (id) => {
    return api.get(`/product/${id}`)
}

// Update product
export const updateNewProduct = async (id, data) => {
    return api.put(`/product/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Delete product
export const deleteNewProduct = async (id) => {
    return api.delete(`/product/${id}`)
}

// Get all products with pagination
export const fetchNewProductsWithLimit = async (limit = 10, skip = 0) => {
    return api.get('/product', {
        params: { limit, skip }
    })
}

// Get products by category with limit
/**
 * data: { 
    limit: number, 
    skip: number, 
    category: string[]
}
 */
export const fetchNewProductByCategoryWithLimit = async (data) => {
    return api.post('/product/by-category-limit', data)
}

// Get all categories
export const fetchAllNewProductCategory = async () => {
    return api.get('/product/categories')
}

// Search products
export const searchNewProducts = async (query, limit = 10, skip = 0) => {
    return api.get('/product/search', {
        params: { query, limit, skip }
    })
}

// Get products by brand
export const fetchProductsByBrand = async (brand) => {
    return api.get(`/product/brand/${brand}`)
}

// Get low stock products
export const fetchLowStockProducts = async (threshold = 20) => {
    return api.get('/product/stock/low', {
        params: { threshold }
    })
}

// Get out of stock products
export const fetchOutOfStockProducts = async () => {
    return api.get('/product/stock/out')
}

// Get price for quantity
export const getPriceForQuantity = async (productId, quantity ) => {
    return api.post(`/product/price/${productId}`, { quantity })
}