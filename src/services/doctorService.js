import db from '../models/index';

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
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    message: "Ko truyền đủ tham số : doctorId ,contentHTML hoặc contentMarkdown",
                    errCode: 1
                });
            } else {
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
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveInforDoctor: saveInforDoctor
}