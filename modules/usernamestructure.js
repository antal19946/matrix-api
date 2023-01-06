const mongoose = require('mongoose')
// const validator = require('validator')


const structureSchema = new mongoose.Schema({
    structure: {
        type: String,
        required: true

    },
    startwith:{
        type: String,
        required: true
    }
   
})
const structureData = new mongoose.model('structureData', structureSchema)
module.exports = structureData