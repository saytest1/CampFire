// seeds/index.js
const { sequelize } = require('../config/database');
const { seedCategories } = require('./001_categories');
const { seedProducts } = require('./002_products');

const runAllSeeds = async () => {
  try {
    console.log('🚀 Bắt đầu seed dữ liệu...');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database sync thành công');
    
    // Chạy seeds theo thứ tự
    await seedCategories();
    await seedProducts();
    
    console.log('🎉 Seed dữ liệu hoàn thành!');
    
  } catch (error) {
    console.error('💥 Lỗi seed:', error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  runAllSeeds();
}

module.exports = { runAllSeeds };