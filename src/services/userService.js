import bcryptjs from 'bcryptjs';
import db from '../models/index';


let handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExit = await checkUserEmail(email);
            if (isExit) { // nếu hàm trả về true 
                var user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });

                let check = await bcryptjs.compareSync(password, user.password);
                if (check) {
                    userData.errMessage = 'Email trùng và pass trùng !'
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
                    attributes: {
                        exclude: ['password']
                    }
                });
            } else if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }


            resolve(users);
        } catch (err) {
            reject(err);
        }
    });
}



let createNewUser = async (newdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkUserEmail(newdata.email);

            if (isExit) { // nếu hàm trả về true 
                userData.message = 'Please check email or enter other email , email existed in database!!!';
                userData.errCode = 1;
            } else {
                let salt = await bcryptjs.genSalt(10); // generate a salt with cost factor of 10
                let hasedPassword = await bcryptjs.hash(newdata.password, salt);

                await db.User.create({
                    firstName: newdata.firstName,
                    lastName: newdata.lastName,
                    email: newdata.email,
                    password: hasedPassword,
                    address: newdata.address,
                    phoneNumber: newdata.phoneNumber,
                    gender: newdata.gender,
                    roleId: newdata.roleId,
                    positionId: newdata.positionId,
                    image: newdata.avatar
                });


                userData.message = 'Create success the new user from react form!!!';
                userData.errCode = 0;
            }

            resolve(userData);
        } catch (err) {
            reject(err);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let errCodeMess = {};
            let user = await db.User.findOne({
                where: {
                    id: userId
                },
                raw: true
            });


            if (!user) {
                errCodeMess.errCode = 0,
                    errCodeMess.message = 'Ko tồn tại email !!!!';
            } else {

                await db.User.destroy({
                    where: {
                        id: userId
                    }
                });

                errCodeMess.errCode = 0,
                    errCodeMess.message = 'Delete succesfully!';
            }

            resolve(errCodeMess);
        } catch (err) {
            reject(err);
        }
    });
}

let updateUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let errCodeMess = {};
            let user = await db.User.findOne({
                where: {
                    id: userId
                },
                raw: true
            });
            if (!user) {
                errCodeMess.message = `loi ko tim thay user id : ${userId} de update`;
                errCodeMess.errCode = 0
                // thành công nhưng mà ko thấy user 
            } else {
                await db.User.update(
                    {
                        firstName: 'CCCC',
                        lastName: 'YDHD',
                        phoneNumber: '00000000000'
                    },
                    { where: { id: userId } }
                );

                errCodeMess.message = `Đã update thành công id : ${userId}`;
                errCodeMess.errCode = 0;
            }

            resolve(errCodeMess);
        } catch (err) {
            reject(err);
        };
    });
}

let updateUserAPIGetUser = (userFromObjReqBody) => {
    return new Promise(async (resolve, reject) => {
        try {
            let errCodeMess = {};
            if (!userFromObjReqBody.id || !userFromObjReqBody.roleId || !userFromObjReqBody.positionId || !userFromObjReqBody.gender) {
                errCodeMess.errCode = 2;
                errCodeMess.message = 'Ko thay id , hoac role , hoac gender';
                resolve(errCodeMess);
            }
            let userGettedFromMySQL = await db.User.findOne({
                where: {
                    id: userFromObjReqBody.id
                },
                raw: true
            });
            if (!userGettedFromMySQL) {
                errCodeMess.errCode = 0;
                errCodeMess.message = `Ko the tim thay user tu mysql mac du da nhan dc : ${userFromObjReqBody.firstName}  truyen vao`;

                resolve(errCodeMess);
            } else {
                if (!userFromObjReqBody.avatar) {
                    await db.User.update(
                        {
                            firstName: userFromObjReqBody.firstNam,
                            lastName: userFromObjReqBody.lastName,
                            address: userFromObjReqBody.address,
                            gender: userFromObjReqBody.gender,
                            positionId: userFromObjReqBody.positionId,
                            roleId: userFromObjReqBody.roleId,
                            phoneNumber: userFromObjReqBody.phoneNumber,
                        },
                        { where: { id: userFromObjReqBody.id } }
                    );
                } else {
                    await db.User.update(
                        {
                            firstName: userFromObjReqBody.firstNam,
                            lastName: userFromObjReqBody.lastName,
                            address: userFromObjReqBody.address,
                            gender: userFromObjReqBody.gender,
                            positionId: userFromObjReqBody.positionId,
                            roleId: userFromObjReqBody.roleId,
                            phoneNumber: userFromObjReqBody.phoneNumber,
                            image : userFromObjReqBody.avatar
                        },
                        { where: { id: userFromObjReqBody.id } }
                    );
                }

                errCodeMess.errCode = 0;
                errCodeMess.message = 'Thành công update user này';

                resolve(errCodeMess);
            }
        } catch (error) {
            reject("Loi tai server , phan userService , let updateUserByAPI : ", error);
        }
    });
};

let getAllCodes = (typeInput) => { // console.log(typeInput)
    return new Promise(async (resolve, reject) => {
        try {
            let response = {};
            if (!typeInput) {
                response.errCode = 1;
                response.message = 'Lỗi query tham số truyền vào ko có !';
            } else {
                let allcodes = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                        // typeInput là khi đăng nhập, chúng ta giữ type của người đó (admin, doctor , patient ), khi chạy hàm này 
                        // typeInput tương ứng tài khoản nào thì lấy ra data type đó . 
                    }
                });

                if (allcodes.length === 0) {
                    response.errCode = 0;
                    response.message = 'Vào được database lấy allcode nhưng type ko có kiểu đó !';
                } else {
                    response.errCode = 0;
                    response.message = 'Thành công lấy được data allcodes';
                    response.dataAllCodes = allcodes;
                }
            }

            resolve(response);

        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodes: getAllCodes,
    updateUserAPIGetUser: updateUserAPIGetUser
}