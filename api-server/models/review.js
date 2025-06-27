// models/review.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'camping_products',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'order_id',
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pros: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cons: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified_purchase'
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'helpful_count'
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_approved'
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_response'
    },
    adminResponseAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'admin_response_at'
    }
  }, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Review.belongsTo(models.CampingProduct, {
      foreignKey: 'product_id',
      as: 'product'
    });
    
    Review.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  };

  return Review;
};

// models/wishlist.js
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'camping_products',
        key: 'id'
      }
    }
  }, {
    tableName: 'wishlists',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id']
      }
    ]
  });

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Wishlist.belongsTo(models.CampingProduct, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return Wishlist;
};