import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import bcryptjs from 'bcryptjs';


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

    return app.use("/", router);
}

module.exports = initWebRoutes;