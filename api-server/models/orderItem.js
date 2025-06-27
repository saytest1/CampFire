// models/orderItem.js
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'camping_products',
        key: 'id'
      }
    },
    // Product info snapshot at order time
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'product_name'
    },
    productSku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'product_sku'
    },
    productImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_image'
    },
    // Quantity and pricing
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    // Type
    type: {
      type: DataTypes.ENUM('purchase', 'rental'),
      defaultValue: 'purchase'
    },
    // For rental items
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
    rentalDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'rental_days'
    },
    rentalPricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'rental_price_per_day'
    },
    // Return condition for rentals
    returnCondition: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'return_condition'
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'return_date'
    },
    damageNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'damage_notes'
    },
    damageFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'damage_fee'
    }
  }, {
    tableName: 'order_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
    
    OrderItem.belongsTo(models.CampingProduct, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return OrderItem;
};