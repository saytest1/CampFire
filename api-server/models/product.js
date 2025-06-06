// models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../models/index').sequelize;
const Category = require('./category'); 
const Admin = require('./admin');      

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },

  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'admin_id',
    references: {
      model: 'admins',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'products',
  timestamps: false
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Product.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin'
});

module.exports = Product;
