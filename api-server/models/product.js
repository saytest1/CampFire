module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock_quantity: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    category_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER
  });

  return Product;
};
