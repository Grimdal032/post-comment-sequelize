'use strict';
module.exports = {
  /**
   * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
   * @param {import("sequelize")} Sequelize - Sequelize
   * **/
  async up(queryInterface, Sequelize) {
    /*
    *CREATE TABLE Posts
    (
        postId       int(11)             NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userId       int(11)             NOT NULL,
        title        varchar(255)        NOT NULL,
        content      varchar(255)        NOT NULL,
        createdAt    datetime            NOT NULL DEFAULT NOW(),
        updatedAt    datetime            NOT NULL DEFAULT NOW(),
        FOREIGN KEY (userId) REFERENCES Users (userId)
    );
    */
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        allowNull: false,
      },
      nickname: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'Users',
          key: 'nickname',
        },
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      likes: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    /**
     * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
     * @param {import("sequelize")} Sequelize - Sequelize
     * **/
    await queryInterface.dropTable('Posts');
  },
};
