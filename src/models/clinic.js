'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        static associate(models) {
        }
    };
    Clinic.init({
        name : DataTypes.STRING , 
        nameEnglish : DataTypes.STRING ,
        address: DataTypes.STRING,
        addressEnglish : DataTypes.STRING,

        descriptionHTML: DataTypes.STRING,
        descriptionHTMLEnglish: DataTypes.STRING,
        descriptionMarkdown: DataTypes.STRING,
        descriptionMarkdownEnglish: DataTypes.STRING,

        image : DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};