import db from '../models/index' ; 
import bcryptjs from 'bcryptjs';
let getHomePage = async(req, res) => {

    try{
        let dbUsers = await db.User.findAll();
        console.log(dbUsers) ;
        return res.render('homepage.ejs');
    }catch(error){
        console.log("Lỗi xảy ra :" + error); //
    }

}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let postUser = async(req, res) => {
    let salt = await bcryptjs.genSalt(10);
    let passHashed = await bcryptjs.hash(req.body.password , salt);
    
    await db.User.create({
        firstName : req.body.firstName , 
        lastName : req.body.lastName , 
        email : req.body.email , 
        password : passHashed , 
        address : req.body.address , 
        phoneNumber : req.body.phoneNumber , 
    });

    console.log(JSON.stringify(req.body));
    console.log('\n'+passHashed);

    
    return res.render('homepage.ejs');
};

let getUser = (req, res) => {
    return res.render('home.ejs');
};

// object: {
//     key: '',
//     value: ''
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    postUser : postUser
}