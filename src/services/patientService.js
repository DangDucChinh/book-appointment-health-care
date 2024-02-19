import db from '../models/index';
import emailService from '../services/emailService';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}}`;
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('\nxác nhận khám đang đây 1 ');
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.timeString) {
                resolve({
                    errCode: 1,
                    message: 'Thiếu hụt tham số truyền vào'
                });
            } else {
            console.log('\nxác nhận khám đang đây 2 ');


                let token = uuidv4();

                await emailService.sendAsimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });
                // khi tạo người dùng thì file or create 
                console.log('token được cấu hình cho patient :', token);


                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                if (user && user[0]) {
            console.log('\nxác nhận khám đang đây 4 \n ', user , );

                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    });
                }

                resolve({
                    errCode: 0,
                    message: 'Save infor patient successfully!'
                });
            }
        } catch (error) {
            console.log('Lỗi từ server patient service!', error);
            reject(error);
        }
    });
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    message: 'Lỗi thiếu tham số truyền vào',
                    errCode: 1
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });


                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        message: 'Thành công cập nhật lịch hẹn'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Cuộc hẹn đã bị hủy hoặc ko hoạt động'
                    })
                }
            }

        } catch (error) {
            console.log('Lỗi từ server patient service! : +++  ', error);
            reject(error);
        }
    });
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}