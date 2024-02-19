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
            let checkObj = checkRequiredFields(inputData);
            console.log('input nạp : ', inputData);

            if (checkObj.isValid === false) {
                resolve({
                    message: `Missing parameter ${checkObj.element}!`,
                    errCode: 1
                });
            } else {

                // update-insert to mardown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        // BUGG
                        contentHTMLEnglish: inputData.contentHTMLEnglish,
                        contentMarkdownEnglish: inputData.contentMarkdownEnglish,
                        descriptionEnglish: inputData.descriptionEnglish,
                        //

                    });
                } else if (inputData.action === 'EDIT') {
                    await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        // BUGG
                        contentHTMLEnglish: inputData.contentHTMLEnglish,
                        contentMarkdownEnglish: inputData.contentMarkdownEnglish,
                        descriptionEnglish: inputData.descriptionEnglish,
                        // clinicId : inputData.clinicId,
                        // specialtyId : inputData.specialtyId,
                        //
                        updateAt: new Date()
                    }, {
                        where: {
                            doctorId: inputData.doctorId
                        },
                    });
                }

                ///
                // update - insert Doctor additional information 
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
                        note: inputData.note,

                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
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
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
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
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown', 'contentHTMLEnglish', 'contentMarkdownEnglish', 'descriptionEnglish'] },
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

                // console.log('doctor z: ',doctorFromDBById);

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
                        date: date,
                        isAvailable: true
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                        // this is the model fisst to the database connection in the produccer , and the model at here is 
                        // the third relationship 1- n : 
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
            // the following is the error message that is the display 
            // the is the interact the error message that the interact

            // the intertract inthe the error message that the 
        } catch (error) {
            reject(error);
        }
    });
}


export const getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu tham số req body truyền từ client!'
                });
            } else {
                let doctor = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown','descriptionEnglish','contentHTMLEnglish','contentMarkdownEnglish'] },
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

                if (doctor && doctor.image) {
                    doctor.image = new Buffer(doctor.image, 'base64').toString('binary');
                }

                if (!doctor) {
                    doctor = {}
                }

                resolve({
                    errCode: 0,
                    message: 'Thành công lấy doctor infor by id!',
                    data: doctor
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

///
let checkRequiredFields = (inputData) => {
    let arrfields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'note', 'specialtyId'];
    // let arrfields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
    //     'nameClinic', 'addressClinic', 'note'];

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrfields.length; i++) {
        if (!inputData[arrfields[i]]) {
            isValid = false;
            element = arrfields[i];
            break;
        }
    }

    return {
        isValid: isValid,
        element: element
    }
};
///


let deleteScheduleDoctorByDate = (doctorIdInput, dateInput, timeTypeInput) => { // CO
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorIdInput || !dateInput || !timeTypeInput) {
                resolve({
                    errCode: 1,
                    message: 'Ko đủ tham số trên params'
                });
            } else {
                let schedule = await db.Schedule.findOne({
                    where: {
                        doctorId: doctorIdInput,
                        date: dateInput,
                        timeType: timeTypeInput
                    }
                });

                console.log('lịch đó : ', schedule);
                if (schedule) {
                    await db.Schedule.update({
                        isAvailable: false
                    },
                        {
                            where: {
                                doctorId: doctorIdInput,
                                date: dateInput,
                                timeType: timeTypeInput
                            },
                            raw: false
                        });
                    resolve({
                        errCode: 0,
                        message: 'Đã tìm thấy lịch đó và thay đổi isAvailable cho nó !',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        message: 'Ko tìm thấy bản ghi thích hợp doctorId ,date và timeType trong database!',
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
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    deleteScheduleDoctorByDate: deleteScheduleDoctorByDate
}