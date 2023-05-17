require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDB = require('./db.js')
const authRouter = require('./routes/auth.router.js')
const middleware = require('./utils/middleware.js')

const app = express()

app.use(cors())
app.use(express.json()) // parse incoming JSON payload

app.use('/api/auth', authRouter)

app.use(middleware.errorHandler)

const start = async () => {
  try {
    await connectDB(`mongodb://127.0.0.1:27017/role_auth`)
    app.listen(8080, () => {
      console.log('Server connected to port 8080')
    })
  } catch (error) {
    console.log('Error: ', error.message)
  }
}

start()
