require('dotenv').config()
const express = require('express')
const connectDB = require('./db.js')

const app = express()

const start = async () => {
  try {
    await connectDB(`mongodb://localhost:27017/role_auth`)
    app.listen(8080, () => {
      console.log('Server connected to port 8080')
    })
  } catch (error) {
    console.log('Error: ', error.message)
  }
}
