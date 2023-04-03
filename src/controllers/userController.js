import db from '../models/index' ; 
import userService from '../services/userService';
let handleLogin = async(req , res)=>{
    // res.send("Đây là api");
    // api dùng để giao tiếp giữa các server , chính vì vậy nó cần sử dụng như một thành phần trong câu lệnh 
    // api cần trả về theo đúng định dạng, thường dường để trả ra data mà thôi 
    // api trả ra 1 object thường dưới dạng json
    let email = req.body.email ; 
    let password = req.body.password ;
    // validate : 
    // b1 : check email có tồn tại ko , nếu ko có bắt lỗi 1
    // b2 : so sánh pass, nếu ko hợp lệ bắt lỗi
    // access_token : JWT json web token
    // sau khi validate user thì cần trả lại thoogn tin user đó 
    let userData = await userService.handleUserLogin(email , password); 

    if(!email || !password){ // <=> email === '' || email === null || email === 'undefined' 
        return res.status(500).json({
            errCode : 1, // mã lỗi , nếu bằng 0 thì mới gọi là login thành công
            message : 'Missing inputs parameters' // thiếu các tham số đầu vào 
        });
    }


    return res.status(200).json({
        errCode  :userData.errCode,
        message  :userData.errMessage,
        user : userData.user, // login user data the form andn the login the form inthe success callback the function international 
        // the request data not the field
    });
};

let getLogin = async(req ,res)=>{
    return res.render('apilogin.ejs');
}

module.exports = {
    handleLogin : handleLogin ,
    getLogin : getLogin
}