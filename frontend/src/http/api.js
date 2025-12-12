import axios from "axios";
// Determine base URL for API
const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
        baseURL,
        headers: {
                'Content-Type': 'application/json'
        }
});
// Create new product (matching new backend structure)
export const createNewProduct = async (data) => {
    return api.post('/products/create', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Fetch single product (matching new backend route)
export const fetchSingleNewProduct = async (id) => {
    return api.get(`/products/details/${id}`)
}

// Update product (matching new backend route)
export const updateNewProduct = async (id, data) => {
    console.log("product id:", id)
    console.log("FormData:", data)
    return api.patch(`/products/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Delete product (matching new backend route)
export const deleteNewProduct = async (id) => {
    return api.delete(`/products/delete/${id}`)
}

// Get all products with pagination (new backend route)
export const fetchNewProductsWithLimit = async (limit = 10, skip = 0) => {
    return api.get('/products/list', {
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
    return api.post('/products/by-category-limit', data)
}

// Get all categories (new backend route)
export const fetchAllNewProductCategory = async () => {
    return api.get('/products/categories')
}

// Search products
export const searchNewProducts = async (query, limit = 10, skip = 0) => {
    return api.get('/products/search', {
        params: { query, limit, skip }
    })
}

// Get products by brand
export const fetchProductsByBrand = async (brand) => {
    return api.get(`/products/brand/${brand}`)
}

// Get low stock products
export const fetchLowStockProducts = async (threshold = 20) => {
    return api.get('/products/stock/low', {
        params: { threshold }
    })
}

// Get out of stock products
export const fetchOutOfStockProducts = async () => {
    return api.get('/products/stock/out')
}

// Get price for quantity
export const getPriceForQuantity = async (productId, quantity ) => {
    return api.post(`/products/price/${productId}`, { quantity })
}