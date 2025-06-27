// models/campingProduct.js
module.exports = (sequelize, DataTypes) => {
  const CampingProduct = sequelize.define('CampingProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(250),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'short_description'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    // Pricing
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'sale_price'
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'original_price'
    },
    // Rental pricing
    rentalPriceDaily: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'rental_price_daily'
    },
    rentalPriceWeekly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'rental_price_weekly'
    },
    rentalDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'rental_deposit'
    },
    // Stock
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_quantity'
    },
    stockForRent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_for_rent'
    },
    // Features & Specs stored as JSON
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    // Images
    mainImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'main_image'
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    // Status flags
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured'
    },
    isBestSeller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_best_seller'
    },
    isNewArrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_new_arrival'
    },
    isAvailableForRent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available_for_rent'
    },
    // SEO
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'meta_title'
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'meta_description'
    },
    // Stats
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    soldCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sold_count'
    },
    rentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'rent_count'
    },
    // Admin tracking
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'admin_id',
      references: {
        model: 'admins',
        key: 'id'
      }
    }
  }, {
    tableName: 'camping_products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (product) => {
        // Auto generate slug from name
        if (!product.slug && product.name) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
        }
        // Auto generate SKU
        if (!product.sku) {
          product.sku = 'CP' + Date.now();
        }
      }
    }
  });

  CampingProduct.associate = (models) => {
    CampingProduct.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    
    CampingProduct.belongsTo(models.Admin, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
    
    CampingProduct.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews'
    });
    
    CampingProduct.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems'
    });
    
    CampingProduct.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cartItems'
    });
  };

  return CampingProduct;
};