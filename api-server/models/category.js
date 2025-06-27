// models/category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(120),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'image_url'
    },
    iconUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'icon_url'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
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
    tableName: 'categories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (category) => {
        // Auto generate slug from name
        if (!category.slug && category.name) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
      }
    }
  });

  Category.associate = (models) => {
    Category.hasMany(models.CampingProduct, {
      foreignKey: 'category_id',
      as: 'products'
    });
    
    Category.belongsTo(models.Admin, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
    
    // Self-referencing for parent-child categories
    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'subcategories'
    });
    
    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parent'
    });
  };

  return Category;
};