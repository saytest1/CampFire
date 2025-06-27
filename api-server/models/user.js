// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'full_name'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+\-() ]+$/
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'avatar_url'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'verification_token'
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reset_password_token'
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_password_expires'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });
    
    User.hasOne(models.Cart, {
      foreignKey: 'user_id',
      as: 'cart'
    });
    
    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews'
    });
    
    User.hasMany(models.Wishlist, {
      foreignKey: 'user_id',
      as: 'wishlist'
    });
  };

  return User;
};