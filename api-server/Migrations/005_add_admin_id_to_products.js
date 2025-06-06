//Migrations/005_add_admin_id_to_products.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'admin_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'admin_id');
  }
};
