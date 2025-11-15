import crypto from 'crypto';
import axios from 'axios';
import createHttpError from 'http-errors';
import Order from '../models/order.model.js';
import { config } from '../config/index.js';

// PhonePe API Configuration
const PHONEPE_MERCHANT_ID = config.phonePeMerchantId;
const PHONEPE_SALT_KEY = config.phonePeSaltKey;
const PHONEPE_SALT_INDEX = config.phonePeSaltIndex || '1';
const PHONEPE_BASE_URL = config.phonePeBaseUrl || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const REDIRECT_URL = `${config.clientUrl}/payment/callback`;
const CALLBACK_URL = `${config.port ? `http://localhost:${config.port}` : 'http://localhost:5000'}/api/v1/payment/callback`;

/**
 * Generate PhonePe Payment Checksum
 */
const generateChecksum = (payload, endpoint) => {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const stringToHash = base64Payload + endpoint + PHONEPE_SALT_KEY;
  const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256Hash}###${PHONEPE_SALT_INDEX}`;
};

/**
 * Verify PhonePe Callback Checksum
 */
const verifyChecksum = (base64Response, receivedChecksum) => {
  const stringToHash = base64Response + PHONEPE_SALT_KEY;
  const calculatedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const calculatedChecksum = `${calculatedHash}###${PHONEPE_SALT_INDEX}`;
  return calculatedChecksum === receivedChecksum;
};

/**
 * Initialize PhonePe Payment
 * POST /api/v1/payment/initiate
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId, amount, userPhone, userName } = req.body;

    // Validate inputs
    if (!orderId || !amount || !userPhone) {
      return next(createHttpError(400, 'Order ID, amount, and user phone are required'));
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }

    // Ensure user owns the order
    if (order.user.toString() !== req.user.id) {
      return next(createHttpError(403, 'Not authorized to pay for this order'));
    }

    // Generate unique transaction ID
    const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;

    // PhonePe payment payload
    const paymentPayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.user.id,
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: REDIRECT_URL,
      redirectMode: 'POST',
      callbackUrl: CALLBACK_URL,
      mobileNumber: userPhone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Generate checksum
    const endpoint = '/pg/v1/pay';
    const checksum = generateChecksum(paymentPayload, endpoint);

    // Base64 encode the payload
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

    // Make API call to PhonePe
    const response = await axios.post(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    // Check if payment initiation was successful
    if (response.data.success) {
      // Update order with transaction details
      order.paymentMethod = 'phonepe';
      order.paymentStatus = 'pending';
      order.phonepeTransactionId = merchantTransactionId;
      await order.save();

      res.json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
          transactionId: merchantTransactionId
        }
      });
    } else {
      return next(createHttpError(400, 'Failed to initiate payment'));
    }
  } catch (err) {
    console.error('PhonePe initiate payment error:', err.response?.data || err.message);
    next(createHttpError(500, err.response?.data?.message || 'Payment initiation failed'));
  }
};

/**
 * PhonePe Payment Callback
 * POST /api/v1/payment/callback
 */
export const paymentCallback = async (req, res, next) => {
  try {
    const { response: base64Response } = req.body;

    if (!base64Response) {
      return next(createHttpError(400, 'Invalid callback data'));
    }

    // Decode the response
    const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf-8');
    const callbackData = JSON.parse(decodedResponse);

    // Verify checksum
    const receivedChecksum = req.headers['x-verify'];
    if (!verifyChecksum(base64Response, receivedChecksum)) {
      return next(createHttpError(400, 'Invalid checksum'));
    }

    const { merchantTransactionId, transactionId, amount, state } = callbackData.data;

    // Find order by transaction ID
    const order = await Order.findOne({ phonepeTransactionId: merchantTransactionId });
    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }

    // Update order based on payment status
    if (state === 'COMPLETED') {
      order.paymentStatus = 'paid';
      order.phonepePaymentId = transactionId;
      order.status = 'confirmed';
    } else if (state === 'FAILED') {
      order.paymentStatus = 'failed';
    } else {
      order.paymentStatus = 'pending';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment callback processed',
      paymentStatus: order.paymentStatus
    });
  } catch (err) {
    console.error('PhonePe callback error:', err);
    next(createHttpError(500, 'Payment callback processing failed'));
  }
};

/**
 * Check Payment Status
 * GET /api/v1/payment/status/:transactionId
 */
export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    // Find order by transaction ID
    const order = await Order.findOne({ phonepeTransactionId: transactionId });
    if (!order) {
      return next(createHttpError(404, 'Transaction not found'));
    }

    // Check status from PhonePe
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    const checksum = generateChecksum({}, endpoint);

    const response = await axios.get(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': PHONEPE_MERCHANT_ID
        }
      }
    );

    if (response.data.success) {
      const paymentData = response.data.data;
      
      // Update order based on current status
      if (paymentData.state === 'COMPLETED' && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.phonepePaymentId = paymentData.transactionId;
        order.status = 'confirmed';
        await order.save();
      } else if (paymentData.state === 'FAILED' && order.paymentStatus !== 'failed') {
        order.paymentStatus = 'failed';
        await order.save();
      }

      res.json({
        success: true,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        data: paymentData
      });
    } else {
      res.json({
        success: false,
        message: 'Unable to fetch payment status',
        paymentStatus: order.paymentStatus
      });
    }
  } catch (err) {
    console.error('PhonePe status check error:', err.response?.data || err.message);
    next(createHttpError(500, 'Failed to check payment status'));
  }
};

/**
 * Refund Payment
 * POST /api/v1/payment/refund
 */
export const refundPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createHttpError(404, 'Order not found'));
    }

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return next(createHttpError(403, 'Only admins can process refunds'));
    }

    // Check if payment was made via PhonePe
    if (order.paymentMethod !== 'phonepe' || order.paymentStatus !== 'paid') {
      return next(createHttpError(400, 'Invalid order for refund'));
    }

    // Generate refund transaction ID
    const merchantRefundId = `REF_${orderId}_${Date.now()}`;

    const refundPayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: order.phonepeTransactionId,
      originalTransactionId: order.phonepePaymentId,
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      callbackUrl: CALLBACK_URL
    };

    const endpoint = '/pg/v1/refund';
    const checksum = generateChecksum(refundPayload, endpoint);
    const base64Payload = Buffer.from(JSON.stringify(refundPayload)).toString('base64');

    const response = await axios.post(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    if (response.data.success) {
      order.paymentStatus = 'refunded';
      order.status = 'cancelled';
      await order.save();

      res.json({
        success: true,
        message: 'Refund initiated successfully',
        data: response.data.data
      });
    } else {
      return next(createHttpError(400, 'Refund initiation failed'));
    }
  } catch (err) {
    console.error('PhonePe refund error:', err.response?.data || err.message);
    next(createHttpError(500, 'Refund processing failed'));
  }
};
