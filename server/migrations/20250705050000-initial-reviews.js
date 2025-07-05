import { ObjectId } from 'mongodb';

const comments = [
  'Tốt',
  'Không hài lòng',
  'Xuất sắc!',
  'Ổn',
  'Sẽ thuê lại',
  'Chất lượng tuyệt vời',
  'Giá hợp lý',
  'Dịch vụ nhanh',
  'Sản phẩm như mô tả',
  'Đáng tiền',
  'Không như mong đợi',
  'Rất hài lòng',
  'Giao hàng nhanh',
  'Đội ngũ hỗ trợ tốt',
  'Sản phẩm mới',
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  async up(db, client) {
    // 1. Get all customers
    const customers = await db.collection('users').find({ role: 'customer' }).toArray();
    if (!customers.length) return;

    // 2. Get all products
    const products = await db.collection('products').find({}).toArray();
    if (!products.length) return;

    // 3. For each product, pick a random customer and create a review
    const reviews = products.map(product => {
      const customer = customers[getRandomInt(0, customers.length - 1)];
      return {
        customerId: customer._id,
        productId: product._id,
        rating: getRandomInt(1, 5),
        comment: comments[getRandomInt(0, comments.length - 1)],
        imageFile: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    if (reviews.length) {
      await db.collection('reviews').insertMany(reviews);
    }
  },

  async down(db, client) {
    // Remove all reviews
    await db.collection('reviews').deleteMany({});
  }
}; 