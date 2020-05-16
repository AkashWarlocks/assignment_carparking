const mongoose = require('mongoose')

const level = new mongoose.Schema({
          levelNo:{
              type:Number,
              unique:true,
              required:true
          },
          rowsNo:{
              type:Number
          }
})

const Level = mongoose.model('Level', level)

module.exports = Level