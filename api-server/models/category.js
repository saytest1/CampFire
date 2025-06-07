module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    admin_id: DataTypes.INTEGER
  });

  return Category;
};
