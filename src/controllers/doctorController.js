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


module.exports = {
    handleGetTopDoctorHome : handleGetTopDoctorHome , 
    handleGetAllDoctor : handleGetAllDoctor , 
    handleSaveInforDoctor : handleSaveInforDoctor , 
    handleGetDetailDoctorById : handleGetDetailDoctorById
}