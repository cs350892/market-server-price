import createHttpError from 'http-errors';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import User from '../models/User.js';

// Basic analytics for admin dashboard
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.find({ stock: { $lt: 50 } }).limit(10).select('id name stock');
    const topCategoriesAgg = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const recentOrders = await Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

    res.json({
      totalUsers,
      totalProducts,
      lowStock,
      topCategories: topCategoriesAgg,
      recentOrdersLast30Days: recentOrders,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
