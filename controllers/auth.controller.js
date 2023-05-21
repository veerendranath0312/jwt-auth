const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register function implementation steps
// 1. check if email and password exist
// 2. if not, send an error message
// 3. check if user already exists
// 4. if yes, send an error message
// 5. if not, hash the password
// 6. create new user with user details and hashed password
// 7. save it in db
// 8. generate the json web token
// 9. send the response with required user details and token
const register = async (req, res) => {
  let { email, password } = req.body

  // check if email and password exist
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    // check if user exists
    let foundUser = await User.findOne({ email })
    if (foundUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)

    // create new user
    const newUser = new User({
      email,
      password,
    })

    // save it to database
    const createdUser = await newUser.save()

    const payload = {
      user: {
        id: createdUser.id,
      },
    }

    // generate the json web token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(201).json({
      success: true,
      message: 'User successfully created',
      user: {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      token,
    })
  } catch (error) {
    res.status(400).json({
      message: 'User creation not successful',
      error: error.message,
    })
  }
}

// Login function implementation steps
// 1. check if user exists
// 2. if no, send the error message
// 3. if exists, compare given password with hashed password
// 4. if password is incorrect, send the error message
// 5. if password is correct, generate json web token
// 6. send the response with the user details and token
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // check if user exists
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      return res.status(400).json({ error: 'User does not exist' })
    }

    // comparing given password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const payload = {
      user: {
        id: foundUser.id,
      },
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        userId: foundUser.id,
        email: foundUser.email,
      },
      token,
    })
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    })
  }
}

const update = async (req, res, next) => {
  const { role, id } = req.body

  // first - verifying if role and id is present
  if (!role || !id) {
    return res.status(400).json({ message: 'Role or Id not present' })
  }

  // second - verifying if the value role is admin
  if (role !== 'admin') {
    return res.status(400).json({ message: 'Role is not admin' })
  }

  // finds the user with the id
  const user = await User.findById(id)

  // third - verifies the user is an admin
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'User is already an Admin' })
  }

  try {
    user.role = role
    const updatedUser = await user.save()
    res.status(200).json({ message: 'Update successful', updatedUser })
  } catch (error) {
    res.status(400).json({ message: 'An error occurred', error: error.message })
  }
}
module.exports = { register, login, update }

// create a random string
// require("crypto").randomBytes(35).toString("hex")
