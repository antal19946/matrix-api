const mongoose = require('mongoose')
// const validator = require('validator')


const E_pinSchema = new mongoose.Schema({
    createdFor_name: {
        type: String,
        required: true

    },
    createdBy: {
        type: String,
        required: true,
       
    },
    createdFor_Id: {
        type: String,
        unique:false
      
    },
    usedFor: {
        type: String,
        // required: true

    },
    status:{
        type:String,
        required: true
    },
    pin: {
        type: String,
        unique:true

    },
    pin_Type: {
        type: String,
        // unique:true

    },
    pin_Amount: {
        type: Number,
        // unique:true

    },
    createdAt_Time: {
        type: String,
        // required:true
    },
    usedAt_Time: {
        type: String,
        // required:true
    },
  
})
const EpinData = new mongoose.model('EpinData', E_pinSchema)
module.exports = EpinData