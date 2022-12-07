'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Likes, {
        foreignKey: 'userId',
      });
    }
  }
  Users.init({
    userId: {
      allowNull: false, // Null 값을 허용하는가? -> false: 허용하지 않는다.
      autoIncrement: true,  // 기본키에 데이터를 넣지 않으면 자동적으로 1씩 증가한 데이터가 삽입된다.
      primaryKey: true, // 기본키
      type: DataTypes.INTEGER,
    },
    nickname: {
      type: DataTypes.STRING, // VARCHAR
      unique: true, // 회원의 ID는 무조건 1개만 존재해야 한다. -> 중복 불가
      allowNull: false, // NULL 값 허용하지 않음.
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW // 아무런 데이터도 넣지 않았을 때 기본적으로 생성되는 값.
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};