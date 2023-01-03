const mongoose = require('mongoose')
// const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
       
    },
    phone: {
        type: Number,
        unique:false
      
    },
    password: {
        type: String,
        required: true

    },
    status:{
        type:String
    },
    user_Id: {
        type: String,
        unique:true

    },
    sponsor_Id: {
        type: String,
        // required:true
    },
    level_upline: 
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
    ,
    level_Team: 
        {
            level_1: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_2: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_3: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_4: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_5: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_6: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_7: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_8: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_9: [
                 {
                    name: {
                        type: String
                    },
                    phone: {
                        type: Number
                    },
                    status: {
                        type: String
                    },
                    user_Id: {
                        type: String
                    },
                    sponsor_Id: {
                        type: String
                    }
                }
            ],
            level_10:
                [
                    {
                        name: {
                            type: String
                        },
                        phone: {
                            type: Number
                        },
                        status: {
                            type: String
                        },
                        user_Id: {
                            type: String
                        },
                        sponsor_Id: {
                            type: String

                        }
                    }],


        }
    


})
const UserData = new mongoose.model('UserData', userSchema)
module.exports = UserData