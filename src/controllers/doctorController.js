import db from '../models/index';
import doctorService from '../services/doctorService';


let handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10; 

    try {
        let respone = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(respone);

    } catch (error) {
        console.log('Lỗi tại server : ', error);
        return res.status(200).json({ 
            errCode : -1,
            message : 'Lỗi from server, fix tại doctorController'
        });
    }
}

let handleGetAllDoctor = async(req, res)=>{
    try {
        let errCodeMessDataDoctorsFromAPI =  await doctorService.getAllDoctor();
        return res.status(200).json(errCodeMessDataDoctorsFromAPI);

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message : 'Lỗi tại server , handleGetAllDoctor',
            errCode : -1
        });
    }
}

let handleSaveInforDoctor = async(req, res)=>{
    try {
        let response = await doctorService.saveInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log("Lỗi tại server, doctorController : ",error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm saveInforDoctor trong file doctorController trên server!'
        });
    }
}

let handleGetDetailDoctorById = async (req, res) =>{
    try {
        let response = await doctorService.getDetailDoctorById(req.query.id) ; 
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm getDetailDoctor by ID trong file doctorController trên server!'
        });
    }
}

let handleBulkCreateSchedule = async (req, res) =>{
    try {
        let response = await doctorService.bulkCreateSchedule(req.body) ; 
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm handleBulkCreateScheduletrong file doctorController trên server!'
        });
    }
}

let handleGetScheduleDoctorByDate = async(req, res) => {
    try{
        let response = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
        // nhận hai tham số trên query 
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm handleGetScheduleDoctorByDate file doctorController trên server!'
        });
    }
}

let handleGetExtraInforDoctorById = async(req, res) => {
    try{
        let response = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm handleGetExtraInforDoctorById file doctorController trên server!'
        });
    }
}

let handleGetProfileDoctorById = async(req, res) => {
    try{
        let response = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm handleGetProfileDoctorById file doctorController trên server!'
        });
    }
}

let handleDeleteScheduleDoctorByDate = async (req , res)=>{
    try{
        let response = await doctorService.deleteScheduleDoctorByDate(req.query.doctorId, req.query.date, req.query.timeType);
        return res.status(200).json(response)
    }catch(error){
        console.log(error);
        return res.status(200).json({
            errCode : -1 , 
            message  :'Lỗi tại hàm handleGetProfileDoctorById file doctorController trên server!'
        });
    }
}


module.exports = {
    handleGetTopDoctorHome : handleGetTopDoctorHome , 
    handleGetAllDoctor : handleGetAllDoctor , 
    handleSaveInforDoctor : handleSaveInforDoctor , 
    handleGetDetailDoctorById : handleGetDetailDoctorById , 
    handleBulkCreateSchedule : handleBulkCreateSchedule,
    handleGetScheduleDoctorByDate : handleGetScheduleDoctorByDate , 
    handleGetExtraInforDoctorById  :handleGetExtraInforDoctorById , 
    handleGetProfileDoctorById : handleGetProfileDoctorById , 
    handleDeleteScheduleDoctorByDate : handleDeleteScheduleDoctorByDate , 
}