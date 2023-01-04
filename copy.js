const express = require('express');
require('./dbconnection/connection')
const os = require("os");
const hostName = os.hostname();
const cors = require('cors')
const app = express()
// const multer = require('multer')
console.log(hostName)
const port = process.env.PORT || 3000
app.use(express.json())
app.use(cors())
// app.use(express.static(__dirname + '/uploads/'))
const UserData = require('./modules/registration')
const EpinData = require('./modules/generate_E_pin')
const IncomeData = require('./modules/Income')
const MatrixData = require('./modules/matrix')
const Matrix_Income_Data = require('./modules/matrix_Income')

const updateLevel = async (user_Id) => {
    const new_userdata = await UserData.findOne({ user_Id })
    let level_upline = new_userdata.level_upline
    objectLenght = Object.keys(level_upline).length;
    var k = 0;
    for (let x in level_upline) {

        var update = await UserData.findOne({ user_Id: level_upline[x] })
        if (update !== null) {
            const objKeys = Object.keys(update?.level_Team)[k]
            console.log(`${objKeys} ${k}`)
            const newTeamData = await update?.level_Team[objKeys].push({
                name: new_userdata.name,
                phone: new_userdata.phone,
                status: new_userdata.status,
                user_Id: new_userdata.user_Id,
                sponsor_Id: new_userdata.sponsor_Id,
            })
            const upload_updated_data = await UserData.findOneAndUpdate({ user_Id: level_upline[x] }, update)
        }
        k++;
        if (k === objectLenght) {
            break;
        }
    }
}

app.post('/register', async (req, res) => {
    try {
        const bodyTest = req.body

        const sponsor_Data = await UserData.findOne({ user_Id: bodyTest.sponsor_Id })
        if (sponsor_Data !== null) {
            const user = new UserData(
                {
                    name: bodyTest.name,
                    email: bodyTest.email,
                    phone: bodyTest.phone,
                    password: bodyTest.password,
                    status: "inactive",
                    user_Id: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000),
                    sponsor_Id: bodyTest.sponsor_Id,
                    level_upline:
                    {
                        sponsor_1: bodyTest.sponsor_Id,
                        sponsor_2: sponsor_Data.level_upline.sponsor_1,
                        sponsor_3: sponsor_Data.level_upline.sponsor_2,
                        sponsor_4: sponsor_Data.level_upline.sponsor_3,
                        sponsor_5: sponsor_Data.level_upline.sponsor_4,
                        sponsor_6: sponsor_Data.level_upline.sponsor_5,
                        sponsor_7: sponsor_Data.level_upline.sponsor_6,
                        sponsor_8: sponsor_Data.level_upline.sponsor_7,
                        sponsor_9: sponsor_Data.level_upline.sponsor_8,
                        sponsor_10: sponsor_Data.level_upline.sponsor_9,
                    },

                    level_Team:
                    {
                        level_1: [],
                        level_2: [],
                        level_3: [],
                        level_4: [],
                        level_5: [],
                        level_6: [],
                        level_7: [],
                        level_8: [],
                        level_9: [],
                        level_10: []


                    }


                }
            )
            const result = await user.save()
            const income = new IncomeData(
                {
                    user_Id: result.user_Id,
                    level_Income: []

                }
            )
            const income_Result = await income.save()
            res.status(201).send(result)
            updateLevel(result.user_Id)

        } else {
            res.status(400).send('sponsor id not exist')
        }

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})




app.listen(port, () => {

    console.log(`server connected successfully on port no. ${port}`)
})
const characters = 'AB_CDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
app.post('/generatepin', async (req, res) => {

    for (let i = 0; i < req.body.number_Of_Pin; i++) {
        try {

            const bodyTest = req.body
            const E_Pin = new EpinData({
                createdFor_name: bodyTest.createdFor_name,
                createdBy: bodyTest.createdBy,
                createdFor_Id: bodyTest.createdFor_Id,
                usedFor: null,
                status: 'Unused',
                pin: generateString(7),
                pin_Type: bodyTest.pin_Type,
                createdAt_Time: new Date(),
                usedAt_Time: null,
            })
            const result = await E_Pin.save()
            console.log(result)

        } catch (e) {
            console.log(e)
            console.log(e)
        }
    }
    res.send('please check result in console')

})



app.post('/avtivate/:user_Id', async (req, res) => {
    const createdFor_Id = req.params.user_Id
    EpinData.findOne({ createdFor_Id: createdFor_Id, status: 'Unused' }, async (err, result) => {
        if (err) {
            res.send(err);
        } else if (result !== null) {
            UserData.findOneAndUpdate({ user_Id: req.body.user_Id, status: 'inactive' }, { status: "Active" }, async (err, userResult) => {
                if (userResult !== null) {
                    test_Matrix(userResult)
                    update_level_income(userResult)

                    const change_Pin_Status = await EpinData.findOneAndUpdate({ pin: result.pin }, { status: "Used", usedAt_Time: new Date(), usedFor: req.body.user_Id })
                    res.send(change_Pin_Status)
                } else {
                    res.send('user not exist')
                }
            })


        } else {
            res.send('Insufficient balance')
        }
    })
})
app.get('/count', async (req, res) => {
    const query = UserData.find()
    query.count(function (err, count) {
        if (err) console.log(err)
        else {
            res.send("count")
            console.log(count)
        }
    })
})
const getMatrixSponsor = (count) => {
    if (count <= 2) {
        return 1
    } else if (count >= 3 && count % 3 < 2) {
        return parseInt(count / 3)
    } else if (count >= 3 && count % 3 === 2) {
        return parseInt((count / 3) + 1)
    }
}
const test_Matrix = async (userResult) => {
    const count = await MatrixData.find().count()
    const sponsor = getMatrixSponsor(count + 1)
    const Matrix_Sponsor_Data = await MatrixData.findOne({ matrix_Position: sponsor })
    console.log(userResult)
    console.log("-------------------------------")
    if (Matrix_Sponsor_Data !== null) {
        try {
            const Matrix = new MatrixData({
                name: userResult.name,
                user_Id: userResult.user_Id,
                matrix_Position: count + 1,
                matrix_upline:
                {
                    sponsor_1: sponsor,
                    sponsor_2: Matrix_Sponsor_Data.matrix_upline.sponsor_1,
                    sponsor_3: Matrix_Sponsor_Data.matrix_upline.sponsor_2,
                    sponsor_4: Matrix_Sponsor_Data.matrix_upline.sponsor_3,
                    sponsor_5: Matrix_Sponsor_Data.matrix_upline.sponsor_4,
                    sponsor_6: Matrix_Sponsor_Data.matrix_upline.sponsor_5,
                    sponsor_7: Matrix_Sponsor_Data.matrix_upline.sponsor_6,
                    sponsor_8: Matrix_Sponsor_Data.matrix_upline.sponsor_7,
                    sponsor_9: Matrix_Sponsor_Data.matrix_upline.sponsor_8,
                    sponsor_10: Matrix_Sponsor_Data.matrix_upline.sponsor_9,
                },

            })
            const MatrixResult = await Matrix.save()
            console.log(MatrixResult)
            update_Matrix_income(MatrixResult)
        } catch (e) {
            console.log(e)
        }
    }
}

const update_level_income = async (userResult) => {
    const level_upline = userResult.level_upline
    let objectLenght = Object.keys(level_upline).length;
    const level_income = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
    var k = 0


    for (let x in level_upline) {

        var Income = await IncomeData.findOne({ user_Id: level_upline[x] })
        const change_income = await Income?.level_Income?.push(
            {
                income: level_income[k],
                recieved_from_user: userResult.user_Id,
                recieved_from_level: k + 1,
                recieved_At: new Date()

            }
        )
        const upload_updated_data = await IncomeData.findOneAndUpdate({ user_Id: level_upline[x] }, Income)
        // console.log(level_income[k])
        if (k === objectLenght) {
            break;
        }
        k++

    }
}

const update_Matrix_income = async (userResult) => {
    const matrix_Income_API = new Matrix_Income_Data({
        matrix_Position: userResult.matrix_Position,
        level_Income: []
    })
    const matrix_Income_API_Result = await matrix_Income_API.save()
    const matrix_upline = userResult.matrix_upline
    let objectLenght = Object.keys(matrix_upline).length;
    const Matrix_income = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
    var k = 0


    for (let x in matrix_upline) {

        var Income = await Matrix_Income_Data.findOne({ matrix_Position: matrix_upline[x] })
        const change_income = await Income?.matrix_income?.push(
            {
                income: Matrix_income[k],
                recieved_from_user: userResult.user_Id,
                recieved_from_level: k + 1,
                recieved_At: new Date()

            }
        )
        const upload_updated_data = await Matrix_Income_Data.findOneAndUpdate({ matrix_Position: matrix_upline[x] }, Income)
        // console.log(level_income[k])
        if (k === objectLenght) {
            break;
        }
        k++

    }
}

app.get('/', async (req, res) => {

    res.send('hello sir')
})