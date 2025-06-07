// models/product.js

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image_url: DataTypes.STRING,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true
  });

  return Product;
};
