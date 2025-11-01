import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/newProduct.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Product
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      brand,
      description,
      discountPercentage,
      mrp,
      rate,
      category,
      stockQuantity,
      hsnNumber,
      gstPercentage,
      quantityBasedPricing,
      packSizes
    } = req.body;

    // Parse category if it's a string
    const categoryArray = typeof category === 'string' ? category.split(',').map(c => c.trim()) : category;

    // Parse JSON fields if they're strings
    const parsedQuantityPricing = typeof quantityBasedPricing === 'string' 
      ? JSON.parse(quantityBasedPricing) 
      : quantityBasedPricing || [];
    
    const parsedPackSizes = typeof packSizes === 'string' 
      ? JSON.parse(packSizes) 
      : packSizes || [];

    let optimizeUrl = '';

    // Handle image upload
    if (req.files && req.files.productImage) {
      const file = req.files.productImage[0];
      const fileName = file.filename;
      const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: 'products-image'
      });

      const publicId = uploadResult.public_id;
      
      // Optimize image URL
      optimizeUrl = cloudinary.url(publicId, {
        transformation: [
          {
            width: 'auto',
            crop: 'fill',
            gravity: 'auto'
          },
          {
            dpr: 'auto',
            fetch_format: 'auto',
            quality: 'auto'
          }
        ]
      });

      // Delete temp file
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.log('Unable to delete local file:', error.message);
      }
    }

    // Create new product
    const newProduct = await Product.create({
      productName,
      brand,
      description,
      productImage: optimizeUrl,
      discountPercentage: discountPercentage || 0,
      mrp,
      rate,
      category: categoryArray,
      stockQuantity: stockQuantity || 0,
      hsnNumber,
      gstPercentage,
      quantityBasedPricing: parsedQuantityPricing,
      packSizes: parsedPackSizes
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    next(createHttpError(500, 'Error creating product: ' + error.message));
  }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching products'));
  }
};

// Get All Products with Pagination
export const getAllProductsWithLimits = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedSkip = parseInt(skip, 10) || 0;

    const totalProducts = await Product.find();
    const totalProductsLength = totalProducts.length;
    const totalPages = Math.ceil(totalProductsLength / parsedLimit);
    const currentPage = Math.floor(parsedSkip / parsedLimit) + 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    const products = await Product.find()
      .limit(parsedLimit)
      .skip(parsedSkip)
      .sort({ productName: 1 });

    // Calculate stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const numberOfProductAddLastMonth = totalProducts.reduce((acc, product) => {
      const productDate = new Date(product.createdAt);
      if (productDate >= thirtyDaysAgo) {
        acc += 1;
      }
      return acc;
    }, 0);

    const productStockStatus = totalProducts.reduce((acc, product) => {
      if (product.stockQuantity > 0) {
        acc.stockQuantity += product.stockQuantity;
      }
      if (product.stockQuantity >= 20) {
        acc.inStock += 1;
      } else if (product.stockQuantity > 0 && product.stockQuantity < 20) {
        acc.lowStock += 1;
      }
      if (product.stockQuantity === 0) {
        acc.outOfStock += 1;
      }
      return acc;
    }, { inStock: 0, outOfStock: 0, lowStock: 0, stockQuantity: 0 });

    res.status(200).json({
      success: true,
      message: 'Product list fetched successfully',
      products,
      lastThirtyDaysProductCount: numberOfProductAddLastMonth,
      productStockStatus,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
      total: totalProductsLength,
      limit: parsedLimit,
      skip: parsedSkip
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching products with pagination'));
  }
};

// Get Products by Category
export const getProductByCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category || !Array.isArray(category) || category.length === 0) {
      return next(createHttpError(400, 'Category is required and must be a non-empty array'));
    }

    const products = await Product.find({ category: { $in: category } });

    if (products.length > 0) {
      res.status(200).json({ 
        success: true, 
        count: products.length,
        products 
      });
    } else {
      next(createHttpError(404, 'No products found for the specified categories'));
    }
  } catch (error) {
    next(createHttpError(500, 'Unable to retrieve products'));
  }
};

// Get Products by Category with Limit
export const getProductByCategoryWithLimit = async (req, res, next) => {
  try {
    const { category, limit = 10, skip = 0 } = req.body;

    if (!category || !Array.isArray(category) || category.length === 0) {
      return next(createHttpError(400, 'Category is required and must be a non-empty array'));
    }

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedSkip = parseInt(skip, 10) || 0;

    const totalProducts = await Product.find({ category: { $in: category } }).sort({ productName: 1 });
    const totalProductAtCategory = totalProducts.length;
    const totalPages = Math.ceil(totalProductAtCategory / parsedLimit);

    // Calculate stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const numberOfProductAddLastMonth = totalProducts.reduce((acc, product) => {
      const productDate = new Date(product.createdAt);
      if (productDate >= thirtyDaysAgo) {
        acc += 1;
      }
      return acc;
    }, 0);

    const productStockStatus = totalProducts.reduce((acc, product) => {
      if (product.stockQuantity > 0) {
        acc.stockQuantity += product.stockQuantity;
      }
      if (product.stockQuantity >= 20) {
        acc.inStock += 1;
      } else if (product.stockQuantity > 0 && product.stockQuantity < 20) {
        acc.lowStock += 1;
      }
      if (product.stockQuantity === 0) {
        acc.outOfStock += 1;
      }
      return acc;
    }, { inStock: 0, outOfStock: 0, lowStock: 0, stockQuantity: 0 });

    const currentPage = Math.floor(parsedSkip / parsedLimit) + 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    const products = await Product.find({ category: { $in: category } })
      .limit(parsedLimit)
      .skip(parsedSkip);

    if (products.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Products found',
        products,
        total: totalProductAtCategory,
        lastThirtyDaysProductCount: numberOfProductAddLastMonth,
        productStockStatus,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        limit: parsedLimit,
        skip: parsedSkip
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'No products found for the specified category' 
      });
    }
  } catch (error) {
    next(createHttpError(500, 'Unable to retrieve products'));
  }
};

// Get Single Product
export const getSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(createHttpError(400, 'Product ID is required'));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      product
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching product'));
  }
};

// Update Product
export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      brand,
      description,
      discountPercentage,
      mrp,
      rate,
      category,
      stockQuantity,
      hsnNumber,
      gstPercentage,
      quantityBasedPricing,
      packSizes
    } = req.body;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    let optimizeUrl = product.productImage;

    // Handle new image upload
    if (req.files && req.files.productImage) {
      // Delete old image from Cloudinary
      if (product.productImage) {
        const imgUrl = product.productImage.split('?')[0];
        const arr = imgUrl.split('/');
        const oldPublicId = `${arr.at(-2)}/${arr.at(-1)}`;
        
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (error) {
          console.log('Error deleting old image:', error.message);
        }
      }

      // Upload new image
      const file = req.files.productImage[0];
      const fileName = file.filename;
      const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: 'products-image'
      });

      const publicId = uploadResult.public_id;
      
      optimizeUrl = cloudinary.url(publicId, {
        transformation: [
          {
            width: 'auto',
            crop: 'fill',
            gravity: 'auto'
          },
          {
            dpr: 'auto',
            fetch_format: 'auto',
            quality: 'auto'
          }
        ]
      });

      // Delete temp file
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.log('Unable to delete local file:', error.message);
      }
    }

    // Parse category if it's a string
    const categoryArray = category 
      ? (typeof category === 'string' ? category.split(',').map(c => c.trim()) : category)
      : product.category;

    // Parse JSON fields if they're strings
    const parsedQuantityPricing = quantityBasedPricing
      ? (typeof quantityBasedPricing === 'string' ? JSON.parse(quantityBasedPricing) : quantityBasedPricing)
      : product.quantityBasedPricing;
    
    const parsedPackSizes = packSizes
      ? (typeof packSizes === 'string' ? JSON.parse(packSizes) : packSizes)
      : product.packSizes;

    // Update product
    product.productName = productName || product.productName;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.productImage = optimizeUrl;
    product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
    product.mrp = mrp || product.mrp;
    product.rate = rate || product.rate;
    product.category = categoryArray;
    product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
    product.hsnNumber = hsnNumber || product.hsnNumber;
    product.gstPercentage = gstPercentage !== undefined ? gstPercentage : product.gstPercentage;
    product.quantityBasedPricing = parsedQuantityPricing;
    product.packSizes = parsedPackSizes;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    next(createHttpError(500, 'Error updating product: ' + error.message));
  }
};

// Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    // Delete image from Cloudinary
    if (product.productImage) {
      const imgUrl = product.productImage.split('?')[0];
      const arr = imgUrl.split('/');
      const oldPublicId = `${arr.at(-2)}/${arr.at(-1)}`;
      
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (error) {
        console.log('Error deleting image:', error.message);
      }
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(createHttpError(500, 'Error deleting product'));
  }
};

// Get All Category Names
export const getAllCategoryNames = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    
    if (!categories.length) {
      return next(createHttpError(404, 'No categories found'));
    }

    const sortedCategories = categories.sort();
    
    res.status(200).json({ 
      success: true, 
      count: sortedCategories.length,
      categories: sortedCategories 
    });
  } catch (error) {
    next(createHttpError(500, 'Unable to retrieve category names'));
  }
};

// Get Price for Quantity (using instance method)
export const getPriceForQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(createHttpError(400, 'Valid quantity is required'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }

    const priceDetails = product.getPriceForQuantity(quantity);

    res.status(200).json({
      success: true,
      productName: product.productName,
      quantity,
      priceDetails
    });
  } catch (error) {
    next(createHttpError(500, 'Error calculating price'));
  }
};

// Search Products
export const searchProducts = async (req, res, next) => {
  try {
    const { query, limit = 10, skip = 0 } = req.query;
    
    if (!query) {
      return next(createHttpError(400, 'Search query is required'));
    }

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedSkip = parseInt(skip, 10) || 0;

    const searchRegex = new RegExp(query, 'i');
    
    const products = await Product.find({
      $or: [
        { productName: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    })
    .limit(parsedLimit)
    .skip(parsedSkip)
    .sort({ productName: 1 });

    const totalCount = await Product.countDocuments({
      $or: [
        { productName: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });

    const totalPages = Math.ceil(totalCount / parsedLimit);
    const currentPage = Math.floor(parsedSkip / parsedLimit) + 1;

    res.status(200).json({
      success: true,
      query,
      count: products.length,
      total: totalCount,
      totalPages,
      currentPage,
      products
    });
  } catch (error) {
    next(createHttpError(500, 'Error searching products'));
  }
};

// Get Products by Brand
export const getProductsByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;
    
    const products = await Product.find({ brand: new RegExp(brand, 'i') });
    
    res.status(200).json({
      success: true,
      brand,
      count: products.length,
      products
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching products by brand'));
  }
};

// Get Low Stock Products
export const getLowStockProducts = async (req, res, next) => {
  try {
    const { threshold = 20 } = req.query;
    const parsedThreshold = parseInt(threshold, 10);
    
    const products = await Product.find({
      stockQuantity: { $lt: parsedThreshold, $gt: 0 }
    }).sort({ stockQuantity: 1 });
    
    res.status(200).json({
      success: true,
      threshold: parsedThreshold,
      count: products.length,
      products
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching low stock products'));
  }
};

// Get Out of Stock Products
export const getOutOfStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ stockQuantity: 0 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(createHttpError(500, 'Error fetching out of stock products'));
  }
};