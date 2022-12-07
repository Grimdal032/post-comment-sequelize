'use strict';
module.exports = {
  /** 
   * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
   * @param {import("sequelize")} Sequelize - Sequelize
  * **/
  async up(queryInterface, Sequelize) {
    /*
    * CREATE TABLE Likes
      (
          likeId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
          postId       int(11)             NOT NULL,
          userId       int(11)             NOT NULL,
          createdAt    datetime            NOT NULL DEFAULT NOW(),
          updatedAt    datetime            NOT NULL DEFAULT NOW(),
          FOREIGN KEY (postId) REFERENCES Posts (postId),
          FOREIGN KEY (userId) REFERENCES Users (userId)
      );
    */
    await queryInterface.createTable('Likes', {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      postId: {
        type: Sequelize.DataTypes.INTEGER,
        // 관계를 맺는다.
        references: { // Users 테이블의 userId랑 관계를 맺었다.
          model: 'Posts', // 어떤 테이블인지
          key : 'postId', // 어떤 테이블의 어떤 Column인지
        },
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        // 관계를 맺는다.
        references: { // Users 테이블의 userId랑 관계를 맺었다.
          model: 'Users', // 어떤 테이블인지
          key : 'userId', // 어떤 테이블의 어떤 Column인지
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW 
      }
    });
  },
  async down(queryInterface, Sequelize) {
  /** 
   * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
   * @param {import("sequelize")} Sequelize - Sequelize
  * **/
    await queryInterface.dropTable('Likes');
  }
};