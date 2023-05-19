'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
        }
    };
    Booking.init({
        statusId : DataTypes.STRING , // key của bảng allcode
        doctorId : DataTypes.INTEGER , // id của bảng user
        patientId : DataTypes.INTEGER ,
        timeType : DataTypes.STRING ,
        date : DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};