'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        static associate(models) {
        }
    };
    Markdown.init({
        contentHTML : DataTypes.TEXT('long') , 
        contentMarkdown: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId : DataTypes.INTEGER,
        clinicId : DataTypes.INTEGER,
        description : DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Markdown',
    });
    return Markdown;
};