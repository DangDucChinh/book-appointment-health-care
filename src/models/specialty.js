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
        image: DataTypes.STRING,
        descriptionHTML : DataTypes.TEXT,
        descriptionMarkdown : DataTypes.TEXT,
        specific : DataTypes.TEXT , // cái này để ghi chi tiết hơn
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};