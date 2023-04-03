'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        static associate(models) {
        }
    };
    History.init({
        patientId: DataTypes.INTEGER,
        doctorId : DataTypes.INTEGER, 
        description : DataTypes.TEXT,
        files : DataTypes.TEXT // dường dẫn của file , lưu hết ảnh trên server
     }, {
        sequelize,
        modelName: 'History',
    });
    return History;
};