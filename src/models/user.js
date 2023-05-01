'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // định danh các mối quan hệ , vd 1 bác sĩ có thể thuộc nhiều phòng khám . 
      // define association here
    }
  };
  User.init({
    // 1. tạo thêm các  thành phần models : 
    // 2. Chỉnh sửa trong migrations : migratiosn là 1 công cụ quản lí cơ sở dữ liệu qua các môi trường và phiển bản khác nhau 
    // nó có thể cập nhật, triển khai cơ sở dl mới 1 cách dễ dàng và nhanh chóng . 
    // 3. Chỉnh sửa trong workbench
    // 4. Khi đó , có thể XÓA hết các bảng cũ trong workbench và chạy lại lệnh : npx sequelize-cli db:migrate
    // 5. Tại sao ko khuyến khích dùng cách đó . Vì đó là cách mà migrations quản lí phiên bản database, nếu sau này thực hiện cập nhật thì cần phải viết thêm hàm cập nhật vào sequelize , chứ ko thì nếu có vấn đề phát sinh thì phải xóa data cũ đi à . 
    // thực hiện viết hàm addColumn tại thành phần hàm addColumn trong hàm up ?
    // 
    // 6. 
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password  : DataTypes.STRING,
    address : DataTypes.STRING , 
    phoneNumber : DataTypes.STRING,
    gender : DataTypes.STRING , 
    roleId : DataTypes.STRING,
    positionId : DataTypes.STRING,
    image : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};