'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comments, {
        foreignKey: 'postId',
      });
      this.hasMany(models.Likes, {
        foreignKey: 'postId',
      });
    }
  }
  Posts.init({
    postId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      // 관계를 맺는다.
      references: { // Users 테이블의 userId랑 관계를 맺었다.
        model: 'Users', // 어떤 테이블인지
        key : 'userId', // 어떤 테이블의 어떤 Column인지
      },
      allowNull: false,
      onDelete: 'cascade',
    },
    nickname: {
      type: DataTypes.STRING,
      references: { 
        model: 'Users',
        key : 'nickname',
      },
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};