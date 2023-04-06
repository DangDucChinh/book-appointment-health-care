import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);

    router.get('/api/login', userController.getLogin); // xử lí khi đăng nhập , thành phần chính trong việc tạo các api
    router.post('/api/login', userController.handleLogin);

    router.post('/post-user', homeController.postUser);
    //
    router.get('/api/get-all-user', userController.handleGetAllUser);
    return app.use("/", router);
}

module.exports = initWebRoutes;