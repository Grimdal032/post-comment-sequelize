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
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nickname: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
  /**
   * @param {import("sequelize").QueryInterface} queryInterface - Sequelize Query Interface
   * @param {import("sequelize")} Sequelize - Sequelize
   * **/
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
