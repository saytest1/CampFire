// seeds/002_products.js
const { Product } = require('../models');

const productsData = [
  // Lều (category_id: 1)
  {
    name: 'Lều Coleman Sundome 4',
    description: 'Lều gia đình cho 4 người, chống nước tốt, dễ dựng',
    price: 2500000,
    stock_quantity: 10,
    category_id: 1,
    image_url: '/images/products/leu-coleman-sundome-4.jpg'
  },
  {
    name: 'Lều MSR Hubba Hubba NX 2',
    description: 'Lều siêu nhẹ cho 2 người, chất lượng cao cho trekking',
    price: 8500000,
    stock_quantity: 5,
    category_id: 1,
    image_url: '/images/products/leu-msr-hubba-2.jpg'
  },
  {
    name: 'Lều Naturehike Cloud-Up 1',
    description: 'Lều 1 người siêu nhẹ, phù hợp cho backpacking',
    price: 1800000,
    stock_quantity: 15,
    category_id: 1,
    image_url: '/images/products/leu-naturehike-cloud-up-1.jpg'
  },
  
  // Giày (category_id: 2)
  {
    name: 'Giày Salomon X Ultra 3 GTX',
    description: 'Giày đi bộ đường dài, chống nước Gore-Tex',
    price: 4200000,
    stock_quantity: 20,
    category_id: 2,
    image_url: '/images/products/giay-salomon-x-ultra-3.jpg'
  },
  {
    name: 'Giày Merrell Moab 3',
    description: 'Giày trekking thoải mái, độ bền cao',
    price: 3500000,
    stock_quantity: 25,
    category_id: 2,
    image_url: '/images/products/giay-merrell-moab-3.jpg'
  },
  {
    name: 'Giày La Sportiva TX4',
    description: 'Giày approach chuyên dụng cho leo núi',
    price: 5200000,
    stock_quantity: 8,
    category_id: 2,
    image_url: '/images/products/giay-la-sportiva-tx4.jpg'
  },
  
  // Áo (category_id: 3)
  {
    name: 'Áo khoác Patagonia Houdini',
    description: 'Áo khoác gió siêu nhẹ, có thể gập gọn',
    price: 3800000,
    stock_quantity: 12,
    category_id: 3,
    image_url: '/images/products/ao-patagonia-houdini.jpg'
  },
  {
    name: 'Áo Arc\'teryx Beta AR',
    description: 'Áo khoác Gore-Tex chống nước cao cấp',
    price: 12000000,
    stock_quantity: 6,
    category_id: 3,
    image_url: '/images/products/ao-arcteryx-beta-ar.jpg'
  },
  {
    name: 'Áo fleece The North Face 100 Glacier',
    description: 'Áo lông cừu giữ nhiệt cơ bản',
    price: 1500000,
    stock_quantity: 30,
    category_id: 3,
    image_url: '/images/products/ao-tnf-100-glacier.jpg'
  }
];

const seedProducts = async () => {
  try {
    console.log('🌱 Seeding products...');
    
    // Xóa dữ liệu cũ
    await Product.destroy({ where: {} });
    
    // Thêm dữ liệu mới
    const products = await Product.bulkCreate(productsData);
    
    console.log(`✅ Đã tạo ${products.length} products`);
    products.forEach(product => {
      console.log(`   - ${product.name} (${product.price.toLocaleString()}đ)`);
    });
    
    return products;
  } catch (error) {
    console.error('❌ Lỗi seed products:', error);
    throw error;
  }
};

module.exports = { seedProducts };