const User = require('../models/User.js')

// Register function implementation steps
// 1. check if email and password exist
// 2. if not, send an error message
// 3. if yes, hash the password
// 4. create the user with user details and hashed password
// 5. save it in the db
// 6. create JWT token
// 7. send the response with required user details and token
const register = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required.' })
  }

  try {
    const newUser = new User({
      email,
      password,
    })

    console.log(newUser)

    const createdUser = await newUser.save()

    res.status(201).json({
      success: true,
      message: 'User successfully created',
      user: {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login function implementation steps
// 1. check if user exists
// 2. if no, send the error message
// 3. if yes, compare the password
// 4. if password is incorrect, send the error message
// 5.
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // check if user exists
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      return res.status(400).json({ error: 'User does not exist' })
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        userId: foundUser.id,
        email: foundUser.email,
      },
    })
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    })
  }
}

module.exports = { register, login }
