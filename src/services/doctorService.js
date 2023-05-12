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
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    message: "Ko truyền đủ tham số : doctorId ,contentHTML hoặc contentMarkdown",
                    errCode: 1
                });
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description
                    });

                    resolve({
                        message: "Khởi tạo markdown thành công ",
                        errCode: 0
                    });

                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        updateAt: new Date()
                    }, {
                        where: {
                            doctorId: inputData.doctorId
                        },
                    });

                    resolve({
                        message: "Chỉnh sửa markdown thành công",
                        errCode: 0
                    });
                }

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
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true,
                });


                if (!doctorFromDBById) {
                    resolve({
                        errCode: 0,
                        message: 'Đã nhận id nhưng ko tìm thấy user này trong data , id có khả năng ko có trong data',
                        data: {}
                    })
                }

                if (doctorFromDBById && doctorFromDBById.image) {
                    doctorFromDBById.image = new Buffer(doctorFromDBById.image, 'base64').toString('binary');

                    resolve({
                        errCode: 0,
                        message: `Tìm thấy doctor tại id  ${idFromRequestQueryId}`,
                        data: doctorFromDBById
                    });
                }
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
                        raw: true
                    });

                    // convert date 
                    if (existing && existing.length > 0) {
                        existing = existing.map(item => {
                            item.date = new Date(item.date).getTime();
                            return item;
                        });
                    }

                    // compare different 
                    let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                        return a.timeType === b.timeType && a.date === b.date;
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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule
}