import createHttpError from 'http-errors';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import { User } from '../models/user.model.js';
import Brand from '../models/brand.model.js';
import Category from '../models/category.model.js';

// Comprehensive analytics for admin dashboard
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const newUsersLast30Days = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Product statistics
    const totalProducts = await Product.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const totalCategories = await Category.countDocuments();
    const lowStock = await Product.find({ stock: { $lt: 50 } })
      .limit(10)
      .select('id name stock brand category')
      .sort({ stock: 1 });
    
    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Revenue statistics
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      { $group: { _id: null, monthlyRevenue: { $sum: '$totalAmount' } } },
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.monthlyRevenue || 0;
    
    // Top categories
    const topCategoriesAgg = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    
    // Top brands
    const topBrandsAgg = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    
    // Recent orders
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .select('totalAmount status createdAt deliveryType');

    res.json({
      success: true,
      users: {
        totalUsers,
        totalAdmins,
        newUsersLast30Days,
      },
      products: {
        totalProducts,
        totalBrands,
        totalCategories,
        lowStock,
      },
      orders: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        recentOrdersLast30Days: recentOrders,
      },
      revenue: {
        totalRevenue,
        monthlyRevenue,
      },
      topCategories: topCategoriesAgg,
      topBrands: topBrandsAgg,
      latestOrders,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Dashboard specific stats - for Dashboard.jsx component
export const getDashboardStats = async (req, res, next) => {
  try {
    // Today's date ke liye
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders
    const todaysOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    });

    const todaySales = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      todaySales,
      totalRevenue,
      totalOrders,
      pendingOrders,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Last 7 days sales data - for chart in Dashboard.jsx
export const getLast7DaysSales = async (req, res, next) => {
  try {
    const salesData = [];
    
    // Last 7 days ka data nikalo
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const orders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate },
        status: { $ne: 'cancelled' }
      });

      const sales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      salesData.push({
        date: date.toISOString().split('T')[0],
        sales: sales,
      });
    }

    res.json({
      success: true,
      salesData,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

