'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.users, {
      //   foreignKey:'userId',
      //   foreignKey:'nickname',
      // })
      this.belongsTo(models.Posts, {
        foreignKey: 'postId',
      });
    }
  }
  Comments.init({
    commentId: {
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
    },
    nickname: {
      type: DataTypes.STRING,
      references: { 
        model: 'Users',
        key : 'nickname',
      },
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Comments',
  });
  return Comments;
};