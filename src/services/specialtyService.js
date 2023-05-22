import db from '../models/index';


let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter '
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
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

            if(data && data.length > 0) {
                data.map(item=>{
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }

            resolve({
                errCode : 0 ,
                message : 'Thành công load data all specialties!',
                data : data
            });


        } catch (error) {
            console.log('Lỗi tại server specialty service !');
            reject(error);
        }
    });
}


module.exports = {
    createNewSpecialty: createNewSpecialty,
    getSpecialty: getSpecialty
}