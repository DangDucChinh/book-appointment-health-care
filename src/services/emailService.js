
"use strict";
require('dotenv').config();
import nodemailer from 'nodemailer';
let sendAsimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD// generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Đặng Đức Chính', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin xác nhận lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmail(dataSend)
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
<h3>Xin chào ${dataSend.patientName} !!!</h3>
<p>Bạn đã nhận được email này vì đã đặt lịch khám bệnh online tại dadcy hospital!</p>
<p>Thông tin đặt lịch khám bệnh:</p>
<p>Thời gian: ${dataSend.time}</p>
<p>Bác sĩ: ${dataSend.doctorName}</p>
<p>Nếu các thông tin trên là đúng, vui lòng nhấp vào liên kết dưới đây để xác nhận và hoàn tất lịch hẹn với chúng tôi!</p>
<a href="${dataSend.redirectLink}" target="_blank">Nhấn vào đây!</a>
<p>Xin chân thành cảm ơn !!!</p>
`;

    }

    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName} !!!</h3>
        <p>You received this email because you made an online appointment at dadcy hospital!</p>
        <p>Information to book an appointment:</p>
        <p>Time : ${dataSend.time}</p>
        <p>Doctor ${dataSend.doctorName}</p>
        <p>If the above information is correct, please click on the link to confirm and complete your appointment with us!</p>
        <a href="${dataSend.redirectLink}" target="_blank">Click here!</a>
        <p>Thank you very much !!!</p>
        `
    }

    return result;
}

module.exports = {
    sendAsimpleEmail: sendAsimpleEmail,
}