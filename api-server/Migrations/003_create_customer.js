// migrations/003_create_customer.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customer_product_views', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      session_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      view_duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Thời gian xem sản phẩm (giây)'
      },
      referrer_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      device_info: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Thông tin thiết bị (mobile, desktop, etc.)'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Tạo các index để tối ưu truy vấn
    await queryInterface.addIndex('customer_product_views', ['customer_id', 'created_at'], {
      name: 'idx_customer_views'
    });

    await queryInterface.addIndex('customer_product_views', ['product_id', 'created_at'], {
      name: 'idx_product_views'
    });

    await queryInterface.addIndex('customer_product_views', ['ip_address', 'created_at'], {
      name: 'idx_ip_views'
    });

    await queryInterface.addIndex('customer_product_views', ['session_id'], {
      name: 'idx_session_views'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('customer_product_views');
  }
};