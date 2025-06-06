// models/admin.js

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      full_name: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      is_superadmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    },
    {
      tableName: 'admins',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Admin.associate = (models) => {
    Admin.hasMany(models.Product, {
      foreignKey: 'admin_id',
      as: 'products',       
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    Admin.hasMany(models.Category, {
      foreignKey: 'admin_id',
      as: 'categories',     
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  };

  return Admin;
};
