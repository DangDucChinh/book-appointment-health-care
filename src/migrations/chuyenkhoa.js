'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chuyenkhoas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ///
        pkOfChuyenkhoa : {type : Sequelize.STRING},

        nameChuyenkhoa : {type : Sequelize.STRING},
        imageChuyenkhoa: {type : Sequelize.STRING},
        contentChuyenkhoa : {type : Sequelize.STRING},

        createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chuyenkhoas');
  }
};
