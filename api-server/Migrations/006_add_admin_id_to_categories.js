//Migrations/006_add_admin_id_to_categories.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('categories', 'admin_id', {
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
    await queryInterface.removeColumn('categories', 'admin_id');
  }
};