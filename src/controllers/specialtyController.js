import specialtyService from '../services/specialtyService';


let handleCreateNewSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(specialty);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server !'
        })
    }
}

// 


let handleGetSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.getSpecialty();
        return res.status(200).json(specialty);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server !'
        })
    }
}


let handleGetDetailSpecialtyById = async(req, res) => {
    try {
        // let specialty = await specialtyService.getDetailSpecialtyById(req.query.specialtyId);
        let specialty = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
        // nhận hai tham số là id special và location để có thể tiến hành lọc 
        return res.status(200).json(specialty);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server !'
        })
    }
};

let handleEditSpecialtyById = async(req, res)=>{
    try {
        let specialty = await specialtyService.editSpecialtyById(req.body);
        return res.status(200).json(specialty);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server !'
        })
    }
};

// TODO: impelemented server should be avaible here installation . 

// to make server work properly we need to install the server and then install the server

// to the server // hùng server and then install the server itself // the server should 

// the server should be installed and stared to install the server itself // the server should

// the server should be installed and try to install the server itself // the install should succes

// the server should be installed and try to install the server itself // the install should success successfully the 



module.exports = {
    handleCreateNewSpecialty: handleCreateNewSpecialty,
    handleGetSpecialty: handleGetSpecialty , 
    handleGetDetailSpecialtyById : handleGetDetailSpecialtyById , 
    handleEditSpecialtyById : handleEditSpecialtyById , 
}

// 