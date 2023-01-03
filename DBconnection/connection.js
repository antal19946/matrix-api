const mongoose = require('mongoose')
console.log(process.env.MONGODB_URI)
const uri = 'mongodb://0.0.0.0:27017/matrix-api'
mongoose.set("strictQuery", false);
mongoose.connect(uri,{
   
    useNewUrlParser:true
}).then(()=>{
    console.log('mongoose connected successfully')
}).catch((e)=>{
    console.log(e)
})
