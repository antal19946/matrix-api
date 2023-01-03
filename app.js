const express = require('express');
require('./dbconnection/connection')
const os = require("os");
const hostName = os.hostname();
const cors = require('cors')
const app = express()
// const multer = require('multer')
console.log(hostName)
const port = process.env.PORT || 8000
app.use(express.json())
app.use(cors())
// app.use(express.static(__dirname + '/uploads/'))
const UserData = require('./modules/registration')

app.post('/register', async (req, res) => {
    try {
        
        const bodyTest = req.body
        const user = new UserData(bodyTest)
        const result = await user.save()
        res.status(201).send(result)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// app.get('/', (req, res) => {
//     res.send('<img src="http://localhost:8000/imagesCapture.JPG" alt="Girl in a jacket" width="500" height="600">')
// })


const test = { level_upline: 
    {
        sponsor_1:null,
        sponsor_2:null,
        sponsor_3:null,
        sponsor_4:null,
        sponsor_5:null,
        sponsor_6:null,
        sponsor_7:null,
        sponsor_8:null,
        sponsor_9:null,
        sponsor_10:null,
    }
}
console.log(JSON.stringify(test))
app.listen(port, () => {

    console.log(`server connected successfully on port no. ${port}`)
})
