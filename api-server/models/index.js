// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Database configuration
const env = process.env.NODE_ENV || 'development';
const config = {
  development: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: console.log
  },
  production: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false
  }
};

const sequelize = new Sequelize(config[env]);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Admin = require('./admin')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.CampingProduct = require('./campingProduct')(sequelize, DataTypes);
db.Cart = require('./cart')(sequelize, DataTypes);
db.CartItem = require('./cartItem')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);
db.Review = require('./review')(sequelize, DataTypes);
db.Wishlist = require('./wishlist')(sequelize, DataTypes);

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = db;