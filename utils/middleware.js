const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    const { password } = error.errors
    if (password) {
      return res.status(400).json({
        message: 'Password is shorter than 6 characters',
      })
    }
  } else if (error.code === 11000) {
    return res.status(400).json({ message: 'User already exists' })
  }

  return res.status(400).json({
    error: error,
  })
}

module.exports = { errorHandler }
