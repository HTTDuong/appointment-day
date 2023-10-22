import db from "../models"

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 ||
                !data.descriptionHTML || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                await db.HandBook.create({
                    name: data.name,
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

let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll();
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

let getDetailHandbookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown']
                })

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

module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById
}