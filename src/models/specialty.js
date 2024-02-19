'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        static associate(models) {
        }
    };
    Specialty.init({
        name : DataTypes.STRING , 
        descriptionHTML : DataTypes.TEXT,
        descriptionMarkdown : DataTypes.TEXT,
        nameEnglish : DataTypes.STRING,
        descriptionHTMLEnglish : DataTypes.TEXT,
        descriptionMarkdownEnglish : DataTypes.TEXT,
        image: DataTypes.STRING,
        specific : DataTypes.TEXT , // cái này để ghi chi tiết hơn

        
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};