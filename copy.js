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
const bcrypt = require("bcrypt")
const UserData = require('./modules/registration')
const EpinData = require('./modules/generate_E_pin')
const IncomeData = require('./modules/Income')
const MatrixData = require('./modules/matrix')
const Matrix_Income_Data = require('./modules/matrix_Income')
const structureData = require('./modules/usernamestructure')
const passwordstructureData = require('./modules/passwordstructure')
const { passwordStrength } = require('check-password-strength')
const validator = require("email-validator")

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

const hashPassword = async (plaintextPassword) => {
    const hash = await bcrypt.hash(plaintextPassword, 10)
    return await hash
}
app.post('/change/user_name_structure', async (req, res) => {
    if (req.body.structure === "auto" || req.body.structure === "menual") {
        const structure = await structureData.find()
        const update = { structure: req.body.structure }
        const updatestructure = await structureData.findOneAndUpdate({ structure: structure[0].structure }, update)
        res.status(201).json({
            status: true,
            updatestructure
        })
    } else {
        res.send('bad credentials')
    }
})
app.post('/change/user_name_structure/startwith', async (req, res) => {
    const structure = await structureData.find()
    const update = { startwith: req.body.startwith }
    const updatestructure = await structureData.findOneAndUpdate({ structure: structure[0].structure }, update)
    res.send(updatestructure)
})
app.post('/change/password_structure', async (req, res) => {
    if (req.body.structure === "auto" || req.body.structure === "menual") {
        const structure = await passwordstructureData.find()
        const update = { structure: req.body.structure }
        const updatestructure = await passwordstructureData.findOneAndUpdate({ structure: structure[0].structure }, update)
        res.send(updatestructure)
    } else {
        res.send('bad credentials')
    }
})
app.post('/change/password_type', async (req, res) => {
    if (req.body.passwordType === "basic" || req.body.passwordType === "strong" || req.body.passwordType === "strongest") {
        const structure = await passwordstructureData.find()
        const update = { passwordType: req.body.passwordType }
        const updatestructure = await passwordstructureData.findOneAndUpdate({ structure: structure[0].structure }, update)
        res.send(updatestructure)
    } else {
        res.send('bad credentials')
    }
})
// app.post('/create/password_structure',async(req,res)=>{
//     const structure = new passwordstructureData({
//         structure:req.body.structure,
//         passwordType:req.body.passwordType
//     })
//     const result = await structure.save()
//     res.send(result)
//     })
const generateUserName = async (userName) => {
    const userName_structure = await structureData.findOne()
    if (userName) {
        if (userName_structure.structure === "auto") {
            const userNmae = `${userName_structure.startwith}${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`
            console.log(userNmae)
            return userNmae
        } else if (userName_structure.structure === "menual") {
            var alfanum = /^[0-9a-zA-Z]+$/
            if (userName.match(alfanum)) {
                console.log(true)
                return userName
            } else {
                console.log(false)
                return false
            }
        }
    } else {
        console.log("please enter user Id")
    }
}
const generatePassword = async (password) => {
    const password_structure = await passwordstructureData.findOne()
    if (password_structure.structure === "auto") {
        return generateString(6)
    } else if (password_structure.structure === "menual") {
        if (password_structure.passwordType === "basic") {
            return password
        } else if (password_structure.passwordType === "strong") {
            if (password.length === 7) {
                return password
            } else {
                return false
            }
        } else if (password_structure.passwordType === "strongest") {
            const isStrong = await passwordStrength(password).value
            console.log(isStrong)
            if (isStrong === "Strong") {
                console.log(password)
                return password
            } else {
                console.log(false)
                return false
            }
        }
    }
}
app.post('/register', async (req, res) => {
    const bodyTest = req.body
    const velidUserName = await generateUserName(bodyTest?.user_Id)
    const isEmail = await validator.validate(bodyTest.email)
    if (bodyTest.phone >= 1000000000 && bodyTest.phone <= 9999999999) {
        if (isEmail) {
            if (velidUserName) {
                try {
                    const sponsor_Data = await UserData.findOne({ user_Id: bodyTest.sponsor_Id })
                    const isexist = await UserData.findOne({ user_Id: velidUserName })
                    const isStrongPassword = await generatePassword(bodyTest.password)
                    if (isStrongPassword) {
                        if (isexist) {
                            res.status(400).json({ massage: 'username already exist' })
                        } else
                            if (sponsor_Data !== null) {
                                const user = new UserData(
                                    {
                                        name: bodyTest.name,
                                        email: bodyTest.email,
                                        phone: bodyTest.phone,
                                        password: isStrongPassword,
                                        status: "inactive",
                                        user_Id: velidUserName,
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
                                        level_Income: [],
                                        total_level_Income: 0
                                    }
                                )
                                const income_Result = await income.save()
                                res.status(201).json({
                                    massage: 'registration success',
                                    result
                                })
                                updateLevel(result.user_Id)
                            } else {
                                res.status(400).json({ massage: 'sponsor id not exist' })
                            }
                    } else {
                        res.status(400).json({ massage: 'please enter strongest password' })
                    }
                } catch (e) {
                    console.log(e)
                    res.status(400).json(e)
                }
            } else {
                res.status(400).json({ massage: 'please enter valid username' })
            }
        } else {
            res.status(400).json({ massage: 'please enter valid email' })
        }
    } else {
        res.status(400).json({ massage: 'please enter valid mobile number' })
    }
})
app.post('/login', async (req, res) => {
    const user_Id = req.body.user_Id
    const password = req.body.password
    const getUserDetail = await UserData.findOne({ user_Id })
    if (getUserDetail) {
        const comparePassword = await bcrypt.compare(password, getUserDetail.password)
        if (getUserDetail && comparePassword) {
            res.send(getUserDetail)
        } else {
            res.send("username or Passwords dose NOT match!")
        }
    } else {
        res.send("username or Passwords dose NOT match!")
    }
})
app.listen(port, () => {
    console.log(`server connected successfully on port no. ${port}`)
})
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
        if (k === objectLenght) {
            break;
        }
        k++
    }
}
app.get('/', async (req, res) => {
    res.send('hello sir')
})

