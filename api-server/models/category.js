// models/category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../models/index').sequelize;
const Admin = require('./admin');   
const Product = require('./product'); 

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'categories',
  timestamps: false
});

Category.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin'
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});

module.exports = Category;
