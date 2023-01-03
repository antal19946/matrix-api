const mongoose = require('mongoose')
// const validator = require('validator')


const IncomeSchema = new mongoose.Schema({
    user_Id: {
        type: String,
        required: true

    },
    level_Income:[ {
       income:{
        type: Number,
        unique:false
       },
       recieved_from_user:{
        type: String,
        unique:false
       },
       recieved_from_level:{
        type: String,
        unique:false
       },
       recieved_At:{
        type: String,
        unique:false
       }
       
    }
   ]
  
})
const IncomeData = new mongoose.model('IncomeData', IncomeSchema)
module.exports = IncomeData