const mongoose = require('mongoose')

const connectDB = async (url) => {
  await mongoose.connect(url, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('MongoDB Connected')
}

module.exports = connectDB
