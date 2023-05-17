const express = require('express')
const { register, login } = require('../controllers/auth.controller.js')

const authRouter = express.Router()

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)

module.exports = authRouter
