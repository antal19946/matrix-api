const mongoose = require('mongoose')
// const validator = require('validator')


const matrix_IncomeSchema = new mongoose.Schema({
    matrix_Position: {
        type: String,
        required: true

    },
    matrix_income:[ {
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
const Matrix_Income_Data = new mongoose.model('Matrix_Income_Data', matrix_IncomeSchema)
module.exports = Matrix_Income_Data