const express = require('express')
const { register, login, update } = require('../controllers/auth.controller.js')

const authRouter = express.Router()

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/updateRole').post(update)

module.exports = authRouter
