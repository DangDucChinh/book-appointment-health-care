'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: { type: Sequelize.STRING },
            nameEnglish: { type: Sequelize.STRING },
            image: { type: Sequelize.BLOB('long') },
            descriptionHTML: { type: Sequelize.TEXT },
            descriptionMarkdown: { type: Sequelize.TEXT },
            descriptionHTMLEnglish: { type: Sequelize.TEXT },
            descriptionMarkdownEnglish: { type: Sequelize.TEXT },
            address: { type: Sequelize.STRING },
            addressEnglish: { type: Sequelize.STRING },

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
        await queryInterface.dropTable('clinics');
    }
};