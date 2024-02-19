'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('handbooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ///
      nameHandbook : {type : Sequelize.STRING},
      contentHandbook : {type : Sequelize.STRING},
      imageHandbook :{type : Sequelize.STRING},

      keyToFindChuyenkhoa : {type : Sequelize.STRING},
      ///
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
    await queryInterface.dropTable('handbooks');
  }
};