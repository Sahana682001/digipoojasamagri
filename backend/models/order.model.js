const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'] },
  qty: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  image: { type: String},
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: [true, 'Product reference is required']
  },
}, { _id: false }); // Prevents automatic _id creation for subdocuments

const shippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: [true, 'Address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  postalCode: { type: String, required: [true, 'Postal code is required'] },
  country: { type: String, required: [true, 'Country is required'] },
  state: { type: String }, // Optional field
  phone: { type: String }  // Optional field
}, { _id: false });

const paymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User reference is required'] 
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'],
    enum: {
      values: ['PayPal', 'Stripe', 'Credit Card', 'Cash On Delivery'],
      message: 'Invalid payment method'
    }
  },
  paymentResult: paymentResultSchema,
  itemsPrice: { 
    type: Number, 
    required: true,
    default: 0 
  },
  taxPrice: { 
    type: Number, 
    required: true,
    default: 0 
  },
  shippingPrice: { 
    type: Number, 
    required: true,
    default: 0 
  },
  totalPrice: { 
    type: Number, 
    required: true,
    default: 0 
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  isDelivered: { 
    type: Boolean, 
    default: false 
  },
  deliveredAt: { 
    type: Date 
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

// Virtual for formatted order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().substring(0, 8).toUpperCase()}`;
});

// Pre-save hook to validate order totals
orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems')) {
    const calculatedItemsPrice = this.orderItems.reduce(
      (acc, item) => acc + (item.price * item.qty), 0
    );
    
    if (Math.abs(calculatedItemsPrice - this.itemsPrice) > 0.01) {
      throw new Error('Items price does not match calculated value');
    }
    
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});

// Static method to get order summary
orderSchema.statics.getOrderSummary = async function(userId) {
  const summary = await this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  return summary[0] || { totalOrders: 0, totalSpent: 0 };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;