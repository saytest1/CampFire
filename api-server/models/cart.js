// models/cart.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    totalItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_items'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'carts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'items'
    });
  };

  return Cart;
};

// models/cartItem.js
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cart_id',
      references: {
        model: 'carts',
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
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
    // Cached price at time of adding
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'cart_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeSave: (item) => {
        // Calculate subtotal
        if (item.type === 'rental' && item.rentalDays) {
          item.subtotal = item.price * item.quantity * item.rentalDays;
        } else {
          item.subtotal = item.price * item.quantity;
        }
      }
    }
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart'
    });
    
    CartItem.belongsTo(models.CampingProduct, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return CartItem;
};