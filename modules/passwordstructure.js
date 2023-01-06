const mongoose = require('mongoose')
// const validator = require('validator')


const passwordstructureSchema = new mongoose.Schema({
    structure: {
        type: String,
        required: true

    },
    passwordType:{
        type: String,
        required: true
    }
   
})
const passwordstructureData = new mongoose.model('passwordstructureData', passwordstructureSchema)
module.exports = passwordstructureData