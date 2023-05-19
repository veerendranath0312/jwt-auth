const express = require('express')
const { getAllUsers } = require('../controllers/users.controller.js')

const userRouter = express.Router()

userRouter.route('/').get(getAllUsers)

module.exports = userRouter
