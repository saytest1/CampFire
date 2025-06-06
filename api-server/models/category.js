// models/category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../models/index').sequelize;

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;