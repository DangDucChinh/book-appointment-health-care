import patientService from '../services/patientService' ; 

let handlePostBookAppointment = async (req, res)=>{
    try{
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    }catch(e){
        return res.status(200).json({
            errCode : -1 ,
            message : 'Lỗi từ server !'
        })
    }
}

let handlePostVerifyBookAppointment = async(req, res)=>{
    try{
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);
    }catch(e){
        return res.status(200).json({
            errCode : -1 ,
            message : 'Lỗi từ server !'
        })
    }
}

module.exports = {
    handlePostBookAppointment : handlePostBookAppointment , 
    handlePostVerifyBookAppointment : handlePostVerifyBookAppointment
}