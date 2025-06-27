// models/order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      field: 'order_number'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('purchase', 'rental'),
      allowNull: false
    },
    // Pricing
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'shipping_fee'
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    // Discount
    discountCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'discount_code'
    },
    // Shipping
    shippingMethod: {
      type: DataTypes.ENUM('standard', 'express', 'pickup'),
      defaultValue: 'standard',
      field: 'shipping_method'
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'estimated_delivery'
    },
    // Address
    shippingFullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'shipping_full_name'
    },
    shippingPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'shipping_phone'
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'shipping_address'
    },
    shippingCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'shipping_city'
    },
    shippingDistrict: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'shipping_district'
    },
    shippingWard: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'shipping_ward'
    },
    shippingNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'shipping_note'
    },
    // Payment
    paymentMethod: {
      type: DataTypes.ENUM('cod', 'bank-transfer', 'credit-card', 'e-wallet'),
      allowNull: false,
      field: 'payment_method'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
      field: 'payment_status'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'transaction_id'
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at'
    },
    // Order Status
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned'
      ),
      defaultValue: 'pending'
    },
    // Rental specific
    rentalStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'rental_start_date'
    },
    rentalEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'rental_end_date'
    },
    rentalStatus: {
      type: DataTypes.ENUM(
        'reserved',
        'picked-up',
        'in-use',
        'returned',
        'overdue'
      ),
      allowNull: true,
      field: 'rental_status'
    },
    rentalDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'rental_deposit'
    },
    depositStatus: {
      type: DataTypes.ENUM('paid', 'refunded', 'partially-refunded'),
      allowNull: true,
      field: 'deposit_status'
    },
    // Tracking
    trackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'tracking_number'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancel_reason'
    },
    // Dates
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'confirmed_at'
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'shipped_at'
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at'
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at'
    }
  }, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (order) => {
        // Auto generate order number
        if (!order.orderNumber) {
          const date = new Date();
          const year = date.getFullYear().toString().substr(-2);
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          order.orderNumber = `CRR${year}${month}${day}${random}`;
        }
      }
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items'
    });
  };

  return Order;
};