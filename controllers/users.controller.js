const User = require('../models/User.js')

const getAllUsers = async (req, res) => {
  const user = await User.findById(req.user.id)
  res.status(200).json(user)
}

module.exports = { getAllUsers }
