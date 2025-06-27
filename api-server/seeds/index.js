// seeds/index.js
require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcryptjs');

// Seed data
const seedData = {
  // Admin data
  admins: [
    {
      email: 'admin@campready.com',
      username: 'admin',
      password: 'admin123',
      fullName: 'System Administrator',
      isSuperadmin: true,
      isActive: true
    },
    {
      email: 'manager@campready.com',
      username: 'manager',
      password: 'manager123',
      fullName: 'Store Manager',
      isSuperadmin: false,
      isActive: true
    }
  ],

  // Categories
  categories: [
    {
      name: 'Lều & Shelter',
      slug: 'leu-shelter',
      description: 'Các loại lều cắm trại, tarp, và nơi trú ẩn ngoài trời',
      imageUrl: '/images/categories/tents.jpg',
      isFeatured: true,
      displayOrder: 1,
      subcategories: [
        { name: 'Lều 1-2 người', slug: 'leu-1-2-nguoi' },
        { name: 'Lều gia đình', slug: 'leu-gia-dinh' },
        { name: 'Lều 4 mùa', slug: 'leu-4-mua' },
        { name: 'Tarp & Footprint', slug: 'tarp-footprint' }
      ]
    },
    {
      name: 'Túi ngủ & Đệm',
      slug: 'tui-ngu-dem',
      description: 'Túi ngủ, đệm hơi, võng và phụ kiện ngủ nghỉ',
      imageUrl: '/images/categories/sleeping.jpg',
      isFeatured: true,
      displayOrder: 2,
      subcategories: [
        { name: 'Túi ngủ mùa hè', slug: 'tui-ngu-mua-he' },
        { name: 'Túi ngủ mùa đông', slug: 'tui-ngu-mua-dong' },
        { name: 'Đệm cách nhiệt', slug: 'dem-cach-nhiet' },
        { name: 'Gối & Phụ kiện', slug: 'goi-phu-kien' }
      ]
    },
    {
      name: 'Ba lô & Túi',
      slug: 'ba-lo-tui',
      description: 'Ba lô leo núi, túi đựng đồ và phụ kiện',
      imageUrl: '/images/categories/backpacks.jpg',
      isFeatured: true,
      displayOrder: 3,
      subcategories: [
        { name: 'Ba lô 20-40L', slug: 'ba-lo-20-40l' },
        { name: 'Ba lô 40-70L', slug: 'ba-lo-40-70l' },
        { name: 'Ba lô trên 70L', slug: 'ba-lo-tren-70l' },
        { name: 'Túi khô & Phụ kiện', slug: 'tui-kho-phu-kien' }
      ]
    },
    {
      name: 'Nấu nướng',
      slug: 'nau-nuong',
      description: 'Bếp gas, nồi, chảo và dụng cụ nấu ăn ngoài trời',
      imageUrl: '/images/categories/cooking.jpg',
      isFeatured: false,
      displayOrder: 4,
      subcategories: [
        { name: 'Bếp & Nhiên liệu', slug: 'bep-nhien-lieu' },
        { name: 'Nồi & Chảo', slug: 'noi-chao' },
        { name: 'Dụng cụ ăn uống', slug: 'dung-cu-an-uong' }
      ]
    },
    {
      name: 'Chiếu sáng',
      slug: 'chieu-sang',
      description: 'Đèn pin, đèn pha, đèn cắm trại',
      imageUrl: '/images/categories/lighting.jpg',
      isFeatured: false,
      displayOrder: 5,
      subcategories: [
        { name: 'Đèn pin & Đèn pha', slug: 'den-pin-den-pha' },
        { name: 'Đèn lều', slug: 'den-leu' },
        { name: 'Pin & Sạc', slug: 'pin-sac' }
      ]
    },
    {
      name: 'Trang phục',
      slug: 'trang-phuc',
      description: 'Áo khoác, quần, giày và phụ kiện outdoor',
      imageUrl: '/images/categories/clothing.jpg',
      isFeatured: true,
      displayOrder: 6,
      subcategories: [
        { name: 'Áo khoác', slug: 'ao-khoac' },
        { name: 'Quần outdoor', slug: 'quan-outdoor' },
        { name: 'Giày leo núi', slug: 'giay-leo-nui' },
        { name: 'Phụ kiện', slug: 'phu-kien' }
      ]
    }
  ],

  // Sample users
  users: [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      fullName: 'John Doe',
      phone: '0912345678',
      address: '123 Nguyễn Huệ',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      isVerified: true
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123',
      fullName: 'Jane Smith',
      phone: '0987654321',
      address: '456 Lê Lợi',
      city: 'Hà Nội',
      district: 'Hoàn Kiếm',
      isVerified: true
    }
  ],

  // Sample products
  products: [
    // Tents
    {
      name: 'Lều Coleman Sundome 4 người',
      brand: 'Coleman',
      description: 'Lều gia đình Coleman Sundome cho 4 người với khả năng chống nước tuyệt vời, dễ dàng lắp đặt trong 10 phút. Thiết kế cửa sổ lớn giúp thông thoáng, phù hợp cho cắm trại gia đình.',
      shortDescription: 'Lều 4 người chống nước, dễ dựng',
      categoryName: 'Lều 1-2 người',
      salePrice: 2500000,
      originalPrice: 3200000,
      rentalPriceDaily: 150000,
      rentalPriceWeekly: 800000,
      rentalDeposit: 1000000,
      stockQuantity: 10,
      stockForRent: 5,
      features: [
        'Chống nước 1500mm',
        'Kích thước: 2.7m x 2.7m x 1.8m',
        'Cửa sổ lớn thông thoáng',
        'Túi đựng tiện lợi',
        'Dễ dàng lắp đặt'
      ],
      specifications: {
        weight: '5.5kg',
        capacity: '4 người',
        seasons: '3 mùa',
        material: 'Polyester 75D',
        waterproof: '1500mm',
        dimensions: '270 x 270 x 180 cm'
      },
      isFeatured: true,
      isBestSeller: true
    },
    {
      name: 'Lều MSR Hubba Hubba NX 2',
      brand: 'MSR',
      description: 'Lều siêu nhẹ cao cấp MSR Hubba Hubba NX cho 2 người, thiết kế 3 mùa với khung nhôm chắc chắn, phù hợp cho trekking và leo núi chuyên nghiệp.',
      shortDescription: 'Lều siêu nhẹ 2 người cho trekking',
      categoryName: 'Lều 1-2 người',
      salePrice: 8500000,
      rentalPriceDaily: 400000,
      rentalPriceWeekly: 2000000,
      rentalDeposit: 3000000,
      stockQuantity: 5,
      stockForRent: 3,
      features: [
        'Siêu nhẹ chỉ 1.72kg',
        'Khung nhôm DAC Featherlite',
        '2 tiền sảnh rộng rãi',
        'Lưới chống côn trùng',
        'Chống nước 3000mm'
      ],
      specifications: {
        weight: '1.72kg',
        capacity: '2 người',
        seasons: '3 mùa',
        material: '20D ripstop nylon',
        waterproof: '3000mm',
        dimensions: '213 x 127 x 100 cm'
      },
      isFeatured: true,
      isNewArrival: true
    },

    // Sleeping bags
    {
      name: 'Túi ngủ The North Face Cat\'s Meow',
      brand: 'The North Face',
      description: 'Túi ngủ 3 mùa The North Face Cat\'s Meow với lông vũ tổng hợp Climashield Prism, giữ ấm tốt ngay cả khi ẩm, nhiệt độ comfort -1°C.',
      shortDescription: 'Túi ngủ 3 mùa chất lượng cao',
      categoryName: 'Túi ngủ mùa đông',
      salePrice: 4200000,
      originalPrice: 5000000,
      rentalPriceDaily: 200000,
      rentalPriceWeekly: 1000000,
      rentalDeposit: 1500000,
      stockQuantity: 15,
      stockForRent: 8,
      features: [
        'Nhiệt độ comfort: -1°C',
        'Lông vũ tổng hợp Climashield',
        'Chống ẩm hiệu quả',
        'Túi đựng compression',
        'Khóa YKK chất lượng'
      ],
      specifications: {
        weight: '1.15kg',
        temperature: '-1°C comfort, -7°C limit',
        material: '40D nylon ripstop',
        fill: 'Climashield Prism',
        dimensions: '198cm x 81cm',
        packSize: '20 x 38cm'
      },
      isBestSeller: true
    },

    // Backpacks
    {
      name: 'Ba lô Osprey Atmos AG 65L',
      brand: 'Osprey',
      description: 'Ba lô trekking cao cấp Osprey Atmos AG 65L với hệ thống đai Anti-Gravity độc quyền, phân phối trọng lượng hoàn hảo cho những chuyến đi dài ngày.',
      shortDescription: 'Ba lô 65L với hệ thống Anti-Gravity',
      categoryName: 'Ba lô 40-70L',
      salePrice: 7800000,
      rentalPriceDaily: 350000,
      rentalPriceWeekly: 1800000,
      rentalDeposit: 2500000,
      stockQuantity: 8,
      stockForRent: 4,
      features: [
        'Hệ thống Anti-Gravity',
        'Dung tích 65L',
        'Rain cover tích hợp',
        'Nhiều ngăn tiện dụng',
        'Khung nhôm chắc chắn'
      ],
      specifications: {
        weight: '2.13kg',
        volume: '65L',
        torsoLength: '46-56cm',
        material: '210D nylon',
        frame: 'Aluminum',
        maxLoad: '25kg'
      },
      isFeatured: true,
      isNewArrival: true
    },

    // Cooking
    {
      name: 'Bếp gas Jetboil Flash',
      brand: 'Jetboil',
      description: 'Hệ thống nấu ăn tích hợp Jetboil Flash với công nghệ FluxRing giúp đun sôi 0.5L nước chỉ trong 100 giây, tiết kiệm gas và thời gian.',
      shortDescription: 'Bếp gas siêu nhanh, tiết kiệm',
      categoryName: 'Bếp & Nhiên liệu',
      salePrice: 3200000,
      originalPrice: 3800000,
      rentalPriceDaily: 150000,
      rentalPriceWeekly: 700000,
      rentalDeposit: 1000000,
      stockQuantity: 20,
      stockForRent: 10,
      features: [
        'Đun sôi 0.5L/100 giây',
        'Công nghệ FluxRing',
        'Nồi 0.8L tích hợp',
        'Chỉ báo nhiệt độ',
        'Gọn nhẹ 371g'
      ],
      specifications: {
        weight: '371g',
        boilTime: '100 seconds/0.5L',
        capacity: '0.8L',
        power: '2600W',
        fuelType: 'Gas canister',
        dimensions: '10.4 x 18cm'
      },
      isBestSeller: true
    },

    // Lighting
    {
      name: 'Đèn pha Petzl Actik Core',
      brand: 'Petzl',
      description: 'Đèn pha đa năng Petzl Actik Core 450 lumens với pin sạc USB, nhiều chế độ sáng phù hợp cho mọi hoạt động outdoor.',
      shortDescription: 'Đèn pha 450 lumens, pin sạc USB',
      categoryName: 'Đèn pin & Đèn pha',
      salePrice: 1800000,
      rentalPriceDaily: 80000,
      rentalPriceWeekly: 400000,
      rentalDeposit: 600000,
      stockQuantity: 25,
      stockForRent: 15,
      features: [
        '450 lumens',
        'Pin sạc USB CORE',
        'Chống nước IPX4',
        '3 chế độ sáng',
        'Dây đeo thoải mái'
      ],
      specifications: {
        weight: '75g',
        lumens: '450',
        beamDistance: '90m',
        battery: 'CORE rechargeable',
        runtime: '2-130 hours',
        waterproof: 'IPX4'
      },
      isNewArrival: true
    },

    // Clothing
    {
      name: 'Áo khoác Patagonia Houdini',
      brand: 'Patagonia',
      description: 'Áo khoác gió siêu nhẹ Patagonia Houdini chỉ 105g, có thể gấp gọn bằng lòng bàn tay, chống gió và nước nhẹ.',
      shortDescription: 'Áo gió siêu nhẹ 105g',
      categoryName: 'Áo khoác',
      salePrice: 3800000,
      stockQuantity: 30,
      stockForRent: 0,
      features: [
        'Siêu nhẹ 105g',
        'Gấp gọn túi riêng',
        'Chống gió hiệu quả',
        'Chống nước nhẹ DWR',
        'Thoáng khí'
      ],
      specifications: {
        weight: '105g',
        material: '100% nylon ripstop',
        dwr: 'Yes',
        pockets: '1 chest pocket',
        fit: 'Regular',
        packable: 'Yes'
      },
      isFeatured: true
    },

    // More products...
    {
      name: 'Giày leo núi Salomon X Ultra 3 GTX',
      brand: 'Salomon',
      description: 'Giày hiking Salomon X Ultra 3 với màng Gore-Tex chống nước, đế Contagrip bám tốt trên mọi địa hình.',
      shortDescription: 'Giày hiking Gore-Tex chống nước',
      categoryName: 'Giày leo núi',
      salePrice: 4500000,
      originalPrice: 5200000,
      stockQuantity: 20,
      stockForRent: 0,
      features: [
        'Màng Gore-Tex chống nước',
        'Đế Contagrip MA',
        'Hệ thống Quicklace',
        'Chassis 3D Advanced',
        'Mũi giày bảo vệ'
      ],
      specifications: {
        weight: '370g/shoe',
        material: 'Synthetic/Textile',
        membrane: 'Gore-Tex',
        sole: 'Contagrip MA',
        drop: '11mm',
        sizes: '39-47'
      },
      isBestSeller: true
    }
  ]
};

// Seed functions
async function seedAdmins() {
  console.log('🌱 Seeding admins...');
  
  for (const adminData of seedData.admins) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await db.Admin.create({
      ...adminData,
      passwordHash: hashedPassword
    });
  }
  
  console.log('✅ Admins seeded');
}

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  for (const userData of seedData.users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await db.User.create({
      ...userData,
      password: hashedPassword
    });
    
    // Create cart for each user
    await db.Cart.create({ userId: user.id });
  }
  
  console.log('✅ Users seeded');
}

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  for (const categoryData of seedData.categories) {
    const { subcategories, ...parentData } = categoryData;
    
    // Create parent category
    const parent = await db.Category.create(parentData);
    
    // Create subcategories
    if (subcategories) {
      let order = 1;
      for (const subData of subcategories) {
        await db.Category.create({
          ...subData,
          parentId: parent.id,
          displayOrder: order++
        });
      }
    }
  }
  
  console.log('✅ Categories seeded');
}

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  // Get admin for products
  const admin = await db.Admin.findOne();
  
  for (const productData of seedData.products) {
    const { categoryName, ...data } = productData;
    
    // Find category
    const category = await db.Category.findOne({
      where: { name: categoryName }
    });
    
    if (!category) {
      console.warn(`Category not found: ${categoryName}`);
      continue;
    }
    
    // Create product
    await db.CampingProduct.create({
      ...data,
      categoryId: category.id,
      adminId: admin.id,
      mainImage: `/images/products/${data.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      images: [
        `/images/products/${data.name.toLowerCase().replace(/\s+/g, '-')}-1.jpg`,
        `/images/products/${data.name.toLowerCase().replace(/\s+/g, '-')}-2.jpg`
      ]
    });
  }
  
  console.log('✅ Products seeded');
}

async function seedReviews() {
  console.log('🌱 Seeding reviews...');
  
  const users = await db.User.findAll();
  const products = await db.CampingProduct.findAll({ limit: 5 });
  
  const reviews = [
    {
      rating: 5,
      title: 'Sản phẩm tuyệt vời!',
      comment: 'Chất lượng rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.',
      pros: 'Chất lượng cao, bền bỉ',
      cons: 'Giá hơi cao',
      isVerifiedPurchase: true
    },
    {
      rating: 4,
      title: 'Hài lòng với sản phẩm',
      comment: 'Sản phẩm tốt, phù hợp với giá tiền. Sẽ mua lại nếu cần.',
      pros: 'Thiết kế đẹp, dễ sử dụng',
      cons: 'Có thể cải thiện phần đóng gói',
      isVerifiedPurchase: true
    }
  ];
  
  for (const product of products) {
    for (let i = 0; i < 2; i++) {
      const user = users[i % users.length];
      const review = reviews[i % reviews.length];
      
      await db.Review.create({
        ...review,
        userId: user.id,
        productId: product.id,
        helpfulCount: Math.floor(Math.random() * 20)
      });
    }
  }
  
  console.log('✅ Reviews seeded');
}

// Main seed function
async function seed() {
  try {
    console.log('🚀 Starting seed process...');
    
    // Sync database
    await db.sequelize.sync({ force: true });
    console.log('✅ Database synced');
    
    // Run seeds in order
    await seedAdmins();
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedReviews();
    
    console.log('🎉 Seed completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@campready.com / admin123');
    console.log('Manager: manager@campready.com / manager123');
    console.log('User: john.doe@example.com / password123');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;