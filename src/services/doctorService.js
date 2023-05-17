import db from '../models/index';
'use strict';
require('dotenv').config();
import _ from 'lodash';

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorsfromdb = await db.User.findAll({
                limit: limitInput,
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });

            resolve({
                message: 'Get Top doctor successfully !',
                errCode: 0,
                data: doctorsfromdb
            });

        } catch (error) {
            reject(error);
        }
    });
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorsFromDb = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['image', 'password']
                }
            });

            resolve({
                message: 'Get allDoctor from database successfully!',
                errCode: 0,
                data: doctorsFromDb
            });


        } catch (error) {
            reject(error);
        }
    });
}


let saveInforDoctor = async (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment || !inputData.selectedProvince
                || !inputData.nameClinic || !inputData.addressClinic) {
                resolve({
                    message: "Ko truyền đủ tham số : doctorId ,contentHTML hoặc contentMarkdown",
                    errCode: 1
                });
            } else {

                // update-insert to mardown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description
                    });
                } else if (inputData.action === 'EDIT') {
                    await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        updateAt: new Date()
                    }, {
                        where: {
                            doctorId: inputData.doctorId
                        },
                    });
                }

                ///
                // update - insert beside markdown 
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                });

                if (doctorInfor) {
                    //update 
                    await db.Doctor_Infor.update({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note ? inputData.note : '',
                        updateAt: new Date()
                    }, {
                        where: {
                            doctorId: inputData.doctorId
                        },
                    });
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note ? inputData.note : '',
                    });
                }
                resolve({
                    message: "Đã chỉnh sửa hoặc lưu thành công",
                    errCode: 0
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getDetailDoctorById = (idFromRequestQueryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idFromRequestQueryId) {
                resolve({
                    errCode: 1,
                    message: 'Ko truyền đủ  tham số, ở đây là req.query.id'
                });
            } else {
                let doctorFromDBById = await db.User.findOne({
                    where: {
                        id: idFromRequestQueryId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                });

                if (doctorFromDBById && doctorFromDBById.image) {
                    doctorFromDBById.image = new Buffer(doctorFromDBById.image, 'base64').toString('binary');
                }

                if (!doctorFromDBById) {
                    doctorFromDBById = {}
                }

                resolve({
                    errCode: 0,
                    message: 'Thành công lấy doctor by id!',
                    data: doctorFromDBById
                })
            }
        } catch (error) {
            console.log("Lỗi tại doctor service", error);
            reject(error);
        }
    });
}

export const bulkCreateSchedule = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.arrSchedule || !inputData.doctorId || !inputData.date) {
                resolve({
                    message: 'Lỗi ko truyền được tham số lên server tại hàm bulkCreateSchedule doctorService',
                    errCode: 1
                });
            } else {
                let schedule = inputData.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = process.env.MAX_NUMBER_SCHEDULE;
                        return item;
                    });

                    // get all existing data
                    let existing = await db.Schedule.findAll({
                        where: { doctorId: inputData.doctorId, date: inputData.date },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        include: [
                            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        ],
                        raw: true,
                        nest: true,
                    });
                    // console.log('Exis : ', existing);

                    // convert date 
                    // if (existing && existing.length > 0) {
                    //     existing = existing.map(item => {
                    //         item.date = new Date(item.date).getTime();
                    //         return item;
                    //     });
                    // }

                    // compare different 
                    let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                        return a.timeType.toString() === b.timeType.toString() && a.date.toString() === b.date.toString();
                    });

                    // console.log('Khác biệt : ', toCreate);

                    if (toCreate && toCreate.length > 0) {
                        await db.Schedule.bulkCreate(toCreate);
                    }
                    resolve({
                        errCode: 0,
                        message: 'Creaet bulk create successfully !'
                    });
                } else {
                    resolve({
                        message: 'Ko có schedule hoặc length schedule <= 0 tại hàm bulkCreateSchedule doctorService',
                        errCode: 1
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: 'Ko đủ tham số query trên url'
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                });

                if (!dataSchedule) {
                    dataSchedule = [];
                    resolve({
                        errCode: 0,
                        message: 'Ko tìm thấy dữ liệu trong scheduel tương ứng doctorId và date, nên trả ra mảng rỗng để điền vào ',
                        data: dataSchedule
                    });
                } else {
                    resolve({
                        errCode: 0,
                        message: 'Trả ra data schedule',
                        data: dataSchedule
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
}

export const getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 0,
                    message: 'Ko có doctor id truyền vào từ tham số trên client',
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                });

                if (!data) {
                    data = {};
                }

                resolve({
                    errCode: 0,
                    message: 'Thành công lấy được doctor by doctor id',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById
}