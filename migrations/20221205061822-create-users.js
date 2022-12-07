'use strict';
module.exports = {
/** 
 * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
 * @param {import("sequelize")} Sequelize - Sequelize
* **/
  async up(queryInterface, Sequelize) {
    /*
    * CREATE TABLE Users
    (
        userId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
        ID           varchar(255) UNIQUE NOT NULL,
        nickname     varchar(255) UNIQUE NOT NULL,
        password     varchar(255)        NOT NULL,
        createdAt    datetime            NOT NULL DEFAULT NOW(),
        updatedAt    datetime            NOT NULL DEFAULT NOW()
    );
    */
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false, // Null 값을 허용하는가? -> false: 허용하지 않는다.
        autoIncrement: true,  // 기본키에 데이터를 넣지 않으면 자동적으로 1씩 증가한 데이터가 삽입된다.
        primaryKey: true, // 기본키
        type: Sequelize.DataTypes.INTEGER,
      },
      nickname: {
        type: Sequelize.DataTypes.STRING, // VARCHAR
        unique: true,  // 회원의 닉네임은 무조건 1개만 존재해야 한다. -> 중복 불가
        allowNull: false, // NULL 값 허용하지 않음.
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW // 아무런 데이터도 넣지 않았을 때 기본적으로 생성되는 값.
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW 
      }
    });
  },
  /** 
   * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
   * @param {import("sequelize")} Sequelize - Sequelize
  * **/
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};