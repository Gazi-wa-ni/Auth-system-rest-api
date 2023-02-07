const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let transpoter = nodemailer.createTransport({
    host :process.env.EMAIL_HOST,
    service:'Gmail',
    port:process.env.EMAIL_PORTS,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

module.exports = transpoter;