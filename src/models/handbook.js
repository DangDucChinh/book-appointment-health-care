'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbook extends Model {
        static associate(models) {
            Handbook.belongsTo(models.Chuyenkhoa, {foreignKey : 'keyToFindChuyenkhoa',targetKey: 'pkOfChuyenkhoa', as : 'findCK'});
        }
    };
    Handbook.init({
        nameHandbook : DataTypes.STRING,
        contentHandbook : DataTypes.STRING, 
        imageHandbook : DataTypes.STRING,

        keyToFindChuyenkhoa : DataTypes.STRING,//nắm giữ khóa ngoại để tìm thằng chuyên khoa
    }, {
        sequelize,
        modelName: 'Handbook',
    });
    return Handbook;
};

// 

