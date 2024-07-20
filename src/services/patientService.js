import { raw } from "body-parser";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';

let postBookAppointment = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: 'Đỗ Quang Huy patient name',
                    time: '8:00 - 9:00 Chủ nhật 1/8/2024',
                    doctorName: 'Quang Huy',
                    redirectLink: 'https://www.youtube.com/watch?v=0GL--Adfqhc'
                })

                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });
                console.log('check user: ', user[0])
                // create a booking record
                if(user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                        
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!'
                })
            }
            
        }catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}