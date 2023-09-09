import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            } else {
                await emailService.sendSimpleEmail({
                    recieverEmail: data.email,
                    patientName: "ThuyDuong",
                    time: "8:00 - 9:00 Chủ nhật 1/8/2023",
                    doctorName: "ThuyDuong",
                    redirectLink: "https://mail.google.com/mail/u/0/#inbox"
                })


                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    default: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        default: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        }

                    })
                }

                resolve({
                    data: user,
                    errCode: 0,
                    errMessage: 'Save Infor user succeed!  '
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}