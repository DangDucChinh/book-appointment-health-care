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


module.exports = {
    handleCreateNewSpecialty: handleCreateNewSpecialty,
    handleGetSpecialty: handleGetSpecialty , 
}