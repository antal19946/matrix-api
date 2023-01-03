const mongoose = require('mongoose')
// const validator = require('validator')


const matrixSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    user_Id: {
        type: String,
        // unique: true

    },
    matrix_Position:{
        type:Number,
        required:true
    },
    matrix_upline:
    {
        sponsor_1: {
            type: String,
            // required: true
        },
        sponsor_2: {
            type: String
        },
        sponsor_3: {
            type: String
        },
        sponsor_4: {
            type: String
        },
        sponsor_5: {
            type: String
        },
        sponsor_6: {
            type: String
        },
        sponsor_7: {
            type: String
        },
        sponsor_8: {
            type: String
        },
        sponsor_9: {
            type: String
        },
        sponsor_10: {
            type: String
        },
    }





})
const MatrixData = new mongoose.model('MatrixData', matrixSchema)
module.exports = MatrixData