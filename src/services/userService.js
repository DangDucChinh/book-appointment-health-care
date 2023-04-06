import bcryptjs from 'bcryptjs';
import db from '../models/index';
let handleUserLogin = async (email, password) => {

    // Xử lí thử trường hợp không có cả email và password 
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {
                errCode: 3,
                errMessage: 'Ko có email, ko có pass hoặc ko có cả 2!'
            };

            let isExit = await checkUserEmail(email);
            if (isExit) { // nếu hàm trả về true 
                var user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId'],
                    where: { email: email },
                    raw: true
                });

                let check = await bcryptjs.compareSync(password, user.password);
                if (check) {
                    userData.errMessage = 'Email có và pass cũng trùng';
                    userData.errCode = 0;
                    delete user.password;
                    userData.user = user;
                } else {
                    userData.errMessage = 'Lỗi pass rồi . email thì có mà pas thì ko ';
                    userData.errCode = 2;
                }
            } else { // nếu hàm trả false , trả ra cho controller 1 đối tượng để trả đối tượng đó cho frontend
                userData.errCode = 1; // lỗi 
                userData.errMessage = 'Lỗi ko có email này , làm ơn thử email khác xem !';
            }

            resolve(userData);
        } catch (err) {
            reject(err);
        }
    });
}

let checkUserEmail = async (email) => { // check email xem có trong db ko ??
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: email
                }
            }); // findOne nếu ko tìm dc giá trị thì trả ra undefined

            if (user) {
                resolve(true); // tìm được thì xuất hiện user, như vậy hàm trả về true ( tức có tìm thấy )
            } else {
                resolve(false); // ko tìm thấy thì hàm trả về false
            }

        } catch (err) {
            reject(err); // từ chối 
        }
    });
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes:{
                        exclude :['password']
                    }
                });
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes:{
                        exclude :['password']
                    }
                });
            }

            console.log(users);
            resolve(users);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser
}