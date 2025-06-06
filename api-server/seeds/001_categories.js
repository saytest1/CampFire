// seeds/001_categories.js
const { Category } = require('../models');

const categoriesData = [
  {
    name: 'Lều',
    description: 'Lều cắm trại các loại: lều 1-2 người, lều gia đình, lều chống mưa gió',
    image_url: '/images/categories/leu.jpg'
  },
  {
    name: 'Giày',
    description: 'Giày đi bộ đường dài, giày leo núi, giày trekking chuyên dụng',
    image_url: '/images/categories/giay.jpg'
  },
  {
    name: 'Áo',
    description: 'Áo khoác outdoor, áo chống nước, áo giữ nhiệt cho hoạt động ngoài trời',
    image_url: '/images/categories/ao.jpg'
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Seeding categories...');
    
    // Xóa dữ liệu cũ
    await Category.destroy({ where: {} });
    
    // Thêm dữ liệu mới
    const categories = await Category.bulkCreate(categoriesData);
    
    console.log(`✅ Đã tạo ${categories.length} categories`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });
    
    return categories;
  } catch (error) {
    console.error('❌ Lỗi seed categories:', error);
    throw error;
  }
};

module.exports = { seedCategories };