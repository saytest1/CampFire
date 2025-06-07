const { Sequelize, DataTypes } = require('sequelize');

// ✅ Cấu hình kết nối Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite', // Hoặc thay bằng 'mysql', 'postgres', v.v.
  storage: './database.sqlite' // SQLite: nơi lưu trữ file DB
  // Nếu dùng MySQL/Postgres, thay bằng:
  // new Sequelize('database', 'username', 'password', { host, dialect })
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Import models
db.Admin = require('./admin')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);

// ✅ Thiết lập quan hệ giữa các model
db.Product.belongsTo(db.Category, {
  foreignKey: 'category_id',
  as: 'category',
});

db.Product.belongsTo(db.Admin, {
  foreignKey: 'admin_id',
  as: 'admin',
});

db.Category.belongsTo(db.Admin, {
  foreignKey: 'admin_id',
  as: 'admin',
});

// ✅ Gọi associate nếu model có define
if (db.Admin.associate) db.Admin.associate(db);
if (db.Category.associate) db.Category.associate(db);
if (db.Product.associate) db.Product.associate(db);

module.exports = db;
