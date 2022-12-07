'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Posts, {
        foreignKey: 'postId',
      });
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
      });
    }
  }
  Likes.init({
    likeId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.INTEGER,
      // 관계를 맺는다.
      references: { // Users 테이블의 userId랑 관계를 맺었다.
        model: 'Posts', // 어떤 테이블인지
        key : 'postId', // 어떤 테이블의 어떤 Column인지
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      // 관계를 맺는다.
      references: { // Users 테이블의 userId랑 관계를 맺었다.
        model: 'Users', // 어떤 테이블인지
        key : 'userId', // 어떤 테이블의 어떤 Column인지
      },
      allowNull: false,
      ondelete: 'cascade',
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
    modelName: 'Likes',
  });
  return Likes;
};