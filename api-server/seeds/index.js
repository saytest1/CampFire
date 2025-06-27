const { sequelize } = require('../config/database');
const { seedCategories } = require('./001_categories');
const { seedProducts } = require('./002_products');

const runAllSeeds = async () => {
  try {
    console.log('Bắt đầu seed dữ liệu...');
    
    await sequelize.sync({ force: false });
    console.log('Database sync thành công');
    
    await seedCategories();
    await seedProducts();
    
    console.log('Seed dữ liệu hoàn thành!');
    
  } catch (error) {
    console.error(' Lỗi seed:', error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  runAllSeeds();
}

module.exports = { runAllSeeds };