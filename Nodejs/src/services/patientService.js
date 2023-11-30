import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.recordId || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    recieverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                //upsert patient - false: exist
                let user = await db.Record.findOne({
                    where: { id: data.recordId }
                });

                // // update patient and check history
                // if (!user[1]) {
                //     user[0].gender = data.selectedGender;
                //     user[0].address = data.address;
                //     user[0].firstName = data.fullName

                let appointment = await db.Booking.findAll({
                    where: {
                        recordId: data.recordId,
                        statusId: ['S1', 'S2']
                    },
                    raw: false
                })
                if (appointment && appointment.length > 0) {
                    resolve({
                        data: user,
                        errCode: 0,
                        errMessage: 'This profile has incomplete appointments. Please complete before scheduling another appointment.!'
                    })
                } else {
                    await db.Booking.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        recordId: data.recordId,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    })
                    resolve({
                        data: user,
                        errCode: 0,
                        errMessage: 'Save Infor user succeed!'
                    })
                }

                //create a booking record
                // if (user && user[0]) {
                //     await db.Booking.findOrCreate({
                //         where: { patientId: user[0].id },
                //         defaults: {
                //             statusId: 'S1',
                //             doctorId: data.doctorId,
                //             patientId: user[0].id,
                //             date: data.date,
                //             timeType: data.timeType,
                //             token: token
                //         }

                //     })
                // }

                // resolve({
                //     data: user,
                //     errCode: 0,
                //     errMessage: 'Save Infor user succeed!  '
                // })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                // +1 here
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    let scheduleApp = await db.Schedule.findOne({
                        where: {
                            doctorId: appointment.doctorId,
                            date: appointment.date,
                            timeType: appointment.timeType
                        },
                        raw: false
                    })
                    scheduleApp.currentNumber = scheduleApp.currentNumber + 1;
                    await scheduleApp.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment succeed!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or doesn't exist"
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let addNewRecord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.fullName || !data.address
                || !data.phoneNumber || !data.gender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let record = await db.Record.create({
                    userId: data.userId,
                    fullName: data.fullName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: 'R3'
                })
                resolve({
                    data: record,
                    errCode: 0,
                    errMessage: 'Save Infor user succeed!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllRecords = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let records = await db.Record.findAll({
                    where: {
                        userId: patientId
                    }
                })
                resolve({
                    errCode: 0,
                    data: records
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let deleteRecord = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundRecord = await db.Record.findOne({
            where: { id: userId.id }
        })

        if (!foundRecord) {
            resolve({
                errCode: 2,
                errMessage: `Record doesn't exist`
            })
        }

        await db.Record.destroy({
            where: { id: userId.id }
        })

        resolve({
            errCode: 0,
            errMessage: 'Record is deleted'
        })
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    buildUrlEmail: buildUrlEmail,
    postVerifyBookAppointment: postVerifyBookAppointment,
    addNewRecord: addNewRecord,
    getAllRecords: getAllRecords,
    deleteRecord: deleteRecord
}