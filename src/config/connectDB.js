const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('database', 'root', 'zalo12345', { // tạo sequelize database
    host: 'localhost', // địa chỉ server ở đây
    dialect: 'mysql',
    logging: false
});

let connectDB = async()=>{ // dùng asyn await cho bất đồng bộ . 
    try{
        await sequelize.authenticate(); // test connect 
        console.log('Connection has been established is successful!');
    }catch(e){
        console.error('Error authenticating to the database: ' + e);
    }
};

module.exports = connectDB;





  
  
  