import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);

    router.get('/api/login', userController.getLogin); 
    router.post('/api/login', userController.handleLogin);

    router.post('/post-user', homeController.postUser);
    router.get('/api/get-all-user', userController.handleGetAllUser); 

    router.post('/api/create-new-user', userController.handleCreateNewUser); 

    router.delete('/api/delete-user/:id', userController.handleDelete);
    router.put('/api/update-user/:id', userController.handleUpdate);

    /// api
    router.get('/api/get-all-codes', userController.handleGetAllCodes);


    // api doctor at home-page 
    router.get('/api/top-doctor-home', doctorController.handleGetTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.handleGetAllDoctor);
    router.post('/api/save-infor-doctor', doctorController.handleSaveInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.handleGetDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.handleBulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.handleGetScheduleDoctorByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.handleGetExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.handleGetProfileDoctorById);

    // patient controller : 
    router.post('/api/patient-book-appointment', patientController.handlePostBookAppointment);



    return app.use("/", router);
}

module.exports = initWebRoutes;