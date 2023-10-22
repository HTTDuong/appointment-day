import db from "../models"

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown
                || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    //BLOB => binary(base64)
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })

        } catch (error) {
            reject(error)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                })
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic;
                } else data = {}


                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateClinicData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters!'
                })
            }
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false
            })
            if (clinic) {
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.descriptionHTML = data.descriptionHTML;
                clinic.descriptionMarkdown = data.descriptionMarkdown;
                if (data.image) {
                    clinic.image = data.image;
                }

                await clinic.save();

                resolve({
                    errCode: 0,
                    message: 'Update clinic succeed!'
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'Clinic not found!'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteClinicData = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.Clinic.findOne({
            where: { id: userId.id }
        })

        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `Clinic doesn't exist`
            })
        }

        await db.Clinic.destroy({
            where: { id: userId.id }
        })

        resolve({
            errCode: 0,
            errMessage: 'Clinic is deleted'
        })
    })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    updateClinicData: updateClinicData,
    deleteClinicData: deleteClinicData
}