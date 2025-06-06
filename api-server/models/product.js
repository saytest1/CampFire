// models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../models/index').sequelize;

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
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;