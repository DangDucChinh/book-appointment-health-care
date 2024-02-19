'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chuyenkhoa extends Model {
        static associate(models) {
            Chuyenkhoa.hasMany(models.Handbook, {
                foreignKey : 'keyToFindChuyenkhoa',
                as : 'findCK'
            });
        }
    };
    Chuyenkhoa.init({
        pkOfChuyenkhoa : DataTypes.STRING,

        nameChuyenkhoa : DataTypes.STRING, 
        imageChuyenkhoa: DataTypes.STRING,
        contentChuyenkhoa : DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Chuyenkhoa',
    });
    return Chuyenkhoa;
};