'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        static associate(models) {
            Markdown.belongsTo(models.User , {foreignKey : 'doctorId'})
        }
    };
    Markdown.init({
        contentHTML : DataTypes.TEXT('long') , 
        contentMarkdown: DataTypes.TEXT('long'),
        contentHTMLEnglish : DataTypes.TEXT('long') , 
        contentMarkdownEnglish : DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId : DataTypes.INTEGER,
        clinicId : DataTypes.INTEGER,
        description : DataTypes.TEXT('long'), 
        descriptionEnglish : DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Markdown',
    });
    return Markdown;
};