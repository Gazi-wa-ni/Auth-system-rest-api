const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transpoter = require('../db/emailConfig');
class userController {

    // ...register user
    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // ...check if user is register
            const checkUser = await userModel.findOne({ email })
            if (checkUser) {
                res.status(201).json({
                    msg: "this email is already in use"
                })
            } else {
                // generate hash password
                const hashPassword = await bcrypt.hash(password, 10)
                const user = new userModel({
                    name: name,
                    email: email,
                    password: hashPassword
                })
                const result = await user.save()
                const userId = result._id;
                const saveCredientail = await jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '10d' });
                if (result) res.status(201).json({
                    msg: "register seccussfully",
                    jwtToken: saveCredientail
                })
            }

        } catch (error) {
            res.status(401).json({ error })
        }
    }

    // ...login result
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email });
            if (user) {

                if (await bcrypt.compare(password, user.password)) {

                    const userId = user._id;

                    const saveCredientail = await jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '10d' });
                    if (saveCredientail) {
                        res.status(200).json({
                            msg: "loged in successfully",
                            jwtToken: saveCredientail
                        })
                    }

                } else {
                    res.status(200).json({
                        msg: "enter correct password"
                    })
                }

            }

        } catch (error) {
            console.log(error);
        }
    }

    // ...get user
    static getUser = async (req, res) => {
        try {
            res.status(201).json({
                user: req.user
            })
        } catch (error) {
            res.status(401).json({
                msg: "user not found"
            })
        }
    }

    // ...send link 
    static sendLink = async (req, res) => {
        try {
            const { email } = req.body;
            console.log(email);
            const result = await userModel.findOne({ email });
            console.log(result);
            if (result) {
                const user = {
                    id: result._id,
                    name: result.name,
                    email: result.email
                }
                const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '15m' })
                const link = `http://localhost:5000/resetPassword/${user.id}/${token}`
                // send email
                let info = await transpoter.sendMail({
                    from: process.env.EMIAL_FROM,
                    to: user.email,
                    subject: "Reset your password this link will expire in 15 minutes",
                    html: `<a href=${link}>click here  </a> to reset your password `
                })
                // console.log(link);
                res.status(201).json({
                    msg: "check your email",
                    link: link
                })
            } else {
                res.status(201).json({ msg: "email is not valid" })
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({
                msg: "user not found"
            })
        }
    }

    // ...reset password
    static resetPassword = async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params.id })
            // generate hash password
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const result = await userModel.findByIdAndUpdate({ _id: req.params.id }, {
                name: user.name,
                emial: user.email,
                password: hashPassword
            })
            if (result) {
                res.status(201).json({
                    msg: "your password is changed successfully"
                })
            }
        } catch (error) {
            res.status(401).json({
                msg: "user not found"
            })
        }
    }

}

module.exports = userController;