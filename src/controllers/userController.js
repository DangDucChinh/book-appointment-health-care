import db from '../models/index';
import userService from '../services/userService';
let handleLogin = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    let userData = await userService.handleUserLogin(email, password);

    if (!email || !password) { // <=> email === '' || email === null || email === 'undefined' 
        return res.status(500).json({
            errCode: 1, // mã lỗi , nếu bằng 0 thì mới gọi là login thành công
            message: 'Missing inputs parameters' // thiếu các tham số đầu vào 
        });
    }

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user, //
    });
};

let getLogin = async (req, res) => {
    return res.render('apilogin.ejs');
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id; // ALL , ID; /req.query dunfg cho get , req.body dung cho post va phai co bodyparser ra urlencoded hoac json
    // req.params la lay truc tiep thanh phan tren duong dan tham so
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Có lỗi ko có id được truyền từ frontend vào server , được viết trên uesrController',
            users: []
        });
    }

    let users = await userService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        message: 'Đã lấy được user dựa theo id hoặc theo all',
        users: users
    });
}

let handleCreateNewUser = async (req, res) => {
    let errCodeMess = await userService.createNewUser(req.body); 
    return res.status(200).json({
        errCode  :errCodeMess.errCode, 
        message  :errCodeMess.message
    });
}

let handleDelete = async(req, res)=>{
    // xử lí việc delete, bằng thư viện axios , nhiệm vụ của chính của controller đó là return 
    // ra các trạng thái và dữ liệu cần thiết. Nếu có lỗi thì bắt lỗi rồi trả ra 1 đối tượng respone
    let errCodeMess = await userService.deleteUser(req.params.id); 
    return res.status(200).json({
        errCode : errCodeMess.errCode,
        message : errCodeMess.message
    });
}

let handleUpdate = async(req, res)=>{
    let errCodeMess = await userService.updateUser(req.params.id);
    return res.status(200).json({
        message : errCodeMess.message, 
        errCode : errCodeMess.errCode
    });
};


let handleGetAllCodes = async(req, res)=>{ // bắt đầu viết chỉn chu hơn
    try {
        let errCodeMess = await userService.getAllCodes(req.query.type);
        return res.status(200).json({
            errCode: errCodeMess.errCode,
            message : errCodeMess.message,
            allcodes : errCodeMess.dataAllCodes
        });
        
    } catch (error) {
        console.log('lỗi exeption : ',error); // ghi lỗi ở đây để biết lối mà fix , lỗi này là exception do try catch bắt 
        return res.status(200).json({ 
            errCode : -1,
            message : 'Lỗi from server , lỗi này hiển thị vì đã chọc đc server nhưng lại ko trích xuất dc dữ liệu'
        });
    }
};


module.exports = {
    handleLogin: handleLogin,
    getLogin: getLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser , 
    handleDelete : handleDelete,
    handleUpdate : handleUpdate, 
    handleGetAllCodes : handleGetAllCodes
}

// controller chỉ có nhiệm vụ đó là phục vụ các tác nhân get/post trong web.js
// chúng được dùng để nhận và trả ra các tham số cần thiết
// còn logic thực sự để bên service làm 

