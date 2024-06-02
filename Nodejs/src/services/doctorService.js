import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            {
                                model: db.Specialty,
                                as: 'specialtyTypeData',
                                attributes: ['name']
                            },
                        ]
                    }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })

        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown',
        'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'note', 'specialtyId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {

                // update, insert to Markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                //upsert to Doctor_Infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })

                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;

                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId

                    await doctorInfor.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,

                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valuevi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valuevi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valuevi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                console.log("check", data)
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        item.currentNumber = 0;
                        return item;
                    })
                }

                // GET ALL EXISTING DATA
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // COMPARE DIFFERENT 
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // CREATE DATA
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName']
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraInforDoctorbyId = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valuevi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valuevi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valuevi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getProfileDoctorbyId = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valuevi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valuevi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valuevi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: ['S2', 'S3'],
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Record, as: 'recordIdTypeData',
                            attributes: ['fullName', 'address', 'gender', 'phoneNumber'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderDataRecord', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatient = (date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: ['S2', 'S1', 'S3'],
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Record, as: 'recordIdTypeData',
                            attributes: ['fullName', 'address', 'gender', 'phoneNumber'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderDataRecord', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'statusTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteBookingPatient = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.Booking.findOne({
            where: { id: userId.id }
        })

        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `Booking doesn't exist`
            })
        }

        await db.Booking.destroy({
            where: { id: userId.id }
        })

        resolve({
            errCode: 0,
            errMessage: 'Booking is deleted'
        })
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType
                || !data.imgBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                // update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false   // trả ra class của sequelize thì mới xài save() được
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }

                // send email
                await emailService.sendAttachment(data);

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

let saveHistory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.History.create({
                patientId: data.patientId,
                doctorId: data.doctorId,
                recordId: data.recordId,
                date: data.date,
                files: data.files,
                fullName: data.fullName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                bookingId: data.bookingId,
            })
            resolve({
                errCode: 0,
                message: 'OK'
            });
        } catch (error) {
            reject(error);
        }
    })
}

let getListHistory = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let histories = await db.History.findAll({
                    where: {
                        patientId: patientId
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'genderDataHistory', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.User, as: 'doctorIdHistory',
                            attributes: ['firstName', 'lastName'],
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: histories
                })
            }
        } catch (error) {
            console.log("check error", error)
            reject(error)
        }
    })
}

let postBookingRecurrence = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.recordId || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                if (data.oldAppointmentId) {
                    let bookData = await db.Booking.create({
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        recordId: data.recordId,
                        date: data.date,
                        timeType: data.timeType,
                        oldAppointmentId: data.oldAppointmentId
                    })
                    let scheduleApp = await db.Schedule.findOne({
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        },
                        raw: false
                    })
                    scheduleApp.currentNumber = scheduleApp.currentNumber + 1;
                    await scheduleApp.save();
                    resolve({
                        data: bookData,
                        errCode: 0,
                        errMessage: 'Save Infor user succeed!'
                    })
                } else {
                    let bookData = await db.Booking.create({
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        recordId: data.recordId,
                        date: data.date,
                        timeType: data.timeType,
                        oldAppointmentId: data.bookingRecurr
                    })
                    let scheduleApp = await db.Schedule.findOne({
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        },
                        raw: false
                    })
                    scheduleApp.currentNumber = scheduleApp.currentNumber + 1;
                    await scheduleApp.save();
                    resolve({
                        data: bookData,
                        errCode: 0,
                        errMessage: 'Save Infor user succeed!'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postDetailRecurrence = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {

                if (!data.oldAppointmentId) {
                    let bookOriginal = await db.Booking.findOne({
                        where: { id: data.id, statusId: 'S3' },
                        include: [
                            {
                                model: db.History,
                            }
                        ],
                        raw: true,
                        nest: true
                    });

                    if (!bookOriginal.History.id) {
                        resolve({
                            data: [],
                            errCode: 1,
                            errMessage: 'Missing required param!'
                        })
                    }

                    let bookData = await db.Booking.findAll({
                        where: { oldAppointmentId: data.id, statusId: 'S3' },
                        include: [
                            {
                                model: db.History,
                            }
                        ],
                        raw: true,
                        nest: true
                    });

                    let result = [bookOriginal, ...bookData];

                    // console.log("check result: ", result);

                    resolve({
                        data: result,
                        errCode: 0,
                        errMessage: 'Save Infor user succeed!'
                    })
                }

                if (data.oldAppointmentId) {
                    let bookOriginal = await db.Booking.findOne({
                        where: { id: data.oldAppointmentId, statusId: 'S3' },
                        include: [
                            {
                                model: db.History,
                            }
                        ],
                        raw: true,
                        nest: true
                    });
                    let bookData = await db.Booking.findAll({
                        where: { oldAppointmentId: data.oldAppointmentId, statusId: 'S3' },
                        include: [
                            {
                                model: db.History,
                            }
                        ],
                        raw: true,
                        nest: true
                    });

                    let result = [bookOriginal, ...bookData];

                    resolve({
                        data: result,
                        errCode: 0,
                        errMessage: 'Save Infor user succeed!'
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorbyId: getExtraInforDoctorbyId,
    getProfileDoctorbyId: getProfileDoctorbyId,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    getListPatient: getListPatient,
    deleteBookingPatient: deleteBookingPatient,
    saveHistory: saveHistory,
    getListHistory: getListHistory,
    postBookingRecurrence: postBookingRecurrence,
    postDetailRecurrence: postDetailRecurrence
}