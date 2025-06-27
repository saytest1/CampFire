// utils/email.js
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email config
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development - log to console
    return {
      sendMail: async (options) => {
        console.log('📧 Email sent:');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html || options.text);
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }
};

const transporter = createTransporter();

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"CampReady Rentals" <${process.env.EMAIL_USER || 'noreply@campready.com'}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML if no text provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmation #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5530;">Order Confirmation</h1>
        <p>Hi ${order.shippingFullName},</p>
        <p>Thank you for your order! We've received your order and will process it soon.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ${order.total.toLocaleString('vi-VN')}đ</p>
        </div>
        
        <h3>Items:</h3>
        <ul>
          ${order.items.map(item => `
            <li>${item.productName} x ${item.quantity} - ${item.subtotal.toLocaleString('vi-VN')}đ</li>
          `).join('')}
        </ul>
        
        <p>We'll send you another email when your order ships.</p>
        
        <p>Best regards,<br>CampReady Rentals Team</p>
      </div>
    `
  }),

  rentalReminder: (order) => ({
    subject: `Reminder: Your rental return date is approaching`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5530;">Rental Return Reminder</h1>
        <p>Hi ${order.user.fullName},</p>
        <p>This is a friendly reminder that your rental items are due for return on:</p>
        <p style="font-size: 18px; font-weight: bold; color: #d97706;">
          ${new Date(order.rentalEndDate).toLocaleDateString()}
        </p>
        
        <h3>Rental Items:</h3>
        <ul>
          ${order.items.filter(i => i.type === 'rental').map(item => `
            <li>${item.productName} x ${item.quantity}</li>
          `).join('')}
        </ul>
        
        <p>Please ensure all items are returned in good condition to avoid any additional charges.</p>
        
        <p>If you need to extend your rental period, please contact us.</p>
        
        <p>Best regards,<br>CampReady Rentals Team</p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};

// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['uploads/products', 'uploads/categories', 'uploads/users', 'uploads/reviews'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    
    if (req.baseUrl.includes('products')) folder += 'products/';
    else if (req.baseUrl.includes('categories')) folder += 'categories/';
    else if (req.baseUrl.includes('users')) folder += 'users/';
    else if (req.baseUrl.includes('reviews')) folder += 'reviews/';
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// Delete file utility
const deleteFile = (filePath) => {
  if (!filePath) return;
  
  const fullPath = path.join(__dirname, '..', filePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Error deleting file:', err);
  });
};

module.exports = {
  upload,
  deleteFile
};