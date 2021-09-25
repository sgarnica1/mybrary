const mongoose = require('mongoose')

const authorShcema = new mongoose.Schema({  
  name: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('Author', authorShcema)