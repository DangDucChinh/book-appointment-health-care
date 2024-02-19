import db from '../models/index';


let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.descriptionHTMLEnglish || !data.descriptionMarkdownEnglish || !data.nameEnglish || !data.imageBase64File) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter for edit'
                });
            } else {
                await db.Specialty.create({
                    image: data.imageBase64File,
                    name: data.name,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    nameEnglish: data.nameEnglish,
                    descriptionHTMLEnglish: data.descriptionHTMLEnglish,
                    descriptionMarkdownEnglish: data.descriptionMarkdownEnglish
                });


                resolve({
                    errCode: 0,
                    message: 'Save thành công specialty new !',
                });
            }


        } catch (error) {
            console.log('Lỗi tại server specialty service !');
            reject(error);
        }
    });
};

let getSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({

            });

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }

            data = await db.Specialty.findAll({
                // include: ['name','nameEnglish']
            });

            resolve({
                errCode: 0,
                message: 'Thành công load data all specialties!',
                data: data
            });


        } catch (error) {
            console.log('Lỗi tại server specialty service !', error);
            reject(error);
        }
    });
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    message: 'Missming query!',
                    errCode: 1
                });
            } else {

                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'descriptionHTMLEnglish', 'descriptionMarkdownEnglish', 'name', 'nameEnglish', 'image'],
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }



                if (data) {

                    let doctorSpecialty = [];
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        // find by location 
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }

                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};

                resolve({
                    errCode: 0,
                    message: 'Get getDetailSpecialtyById và province id successfully!',
                    data
                });
            }
        } catch (error) {
            console.log('Lỗi tại get detail specialty !');
            reject(error);
        }
    });
}

let editSpecialtyById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.descriptionHTMLEnglish || !data.descriptionMarkdownEnglish || !data.nameEnglish || !data.imageBase64File) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter '
                });
            } else {
                await db.Specialty.update({
                    image: data.imageBase64File,
                    name: data.name,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    nameEnglish: data.nameEnglish,
                    descriptionHTMLEnglish: data.descriptionHTMLEnglish,
                    descriptionMarkdownEnglish: data.descriptionMarkdownEnglish
                }, {
                    where: {
                        id: data.selectedSpecialty.value
                    },
                    raw: false
                });

                resolve({
                    errCode: 0,
                    message: 'Save thành công specialty new !',
                });
            }
        } catch (error) {
            console.log('Lỗi tại edit  specialty !');
            reject(error);
        }
    });
}


module.exports = {
    createNewSpecialty: createNewSpecialty,
    getSpecialty: getSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    editSpecialtyById: editSpecialtyById
}