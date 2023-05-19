import db from '../models/index';
require('dotenv').config();

export const postBookAppointment = (data)=>{
    return new Promise(async(resolve,reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date){
                resolve({
                    errCode : 1,
                    message : 'Thiếu hụt tham số truyền vào'
                });
            } else{
                //upser patient
                let user = await db.User.findOrCreate({
                    where : {
                        email : data.email
                    },
                    defaults : {
                        email : data.email , 
                        roleId : 'R3'
                    },
                });

                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where : {patientId : user[0].id},
                        defaults : {
                            statusId : 'S1' ,
                            doctorId : data.doctorId , 
                            patientId : user[0].id , 
                            date : data.date ,
                            timeType : data.timeType
                        }
                    });
                }

                resolve({
                    errCode : 0 , 
                    message : 'Save infor patient successfully!'
                });
            }
        } catch (error) {
            console.log('Lỗi từ server patient service!',error);
            reject(error);
        }
    });
}

module.exports = {
    postBookAppointment : postBookAppointment
}