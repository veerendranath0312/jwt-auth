require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(express.json())

const users = []

// Auth middleware to verify token
const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }

  // extract the token
  const token = req.headers['authorization'].split(' ')[1]
  if (!token) {
    return res.status(401).send('Access denied. No token provided.')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(400).send('Invalid token.')
  }
}

app.get('/api/users', verifyUserToken, (req, res) => {
  res.status(200).json(users)
})

// Create a register route
app.post('/api/register', async (req, res) => {
  const user = req.body

  if (!user.email || !user.password) {
    return res.status(400).send('Username and password are required.')
  }

  const hash = await bcrypt.hash(user.password, 10)
  user.password = hash

  users.push(user)

  res.status(201).json(user)
})

// Create a login route
app.post('/api/login', async (req, res) => {
  const user = req.body

  // check if user exists
  const foundUser = users.find((user) => user.email === req.body.email)
  if (!foundUser) {
    return res.status(400).send('Invalid email or password')
  }

  // check if password is correct
  const isPasswordValid = await bcrypt.compare(
    user.password,
    foundUser.password
  )
  if (!isPasswordValid) {
    return res.status(400).send('Invalid email or password')
  }

  // create token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.status(200).json({ token })
})

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})
