const mongoose = require('mongoose')
const Config = require('../../config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: false,
    },
    cardId: {
        type: String,
        require: false,
    },
    address: {
        type: String,
        require: false
    },
    typeAccount: {
        type: Number,
        default: Config.MEMBER_ACCOUNT
    },
    activeStatus: {
        type: Boolean,
        default: false,
        require: true,
        index: true
    },
    imagePath: {
        type: String,
        default: "/images/default_user.png",
        require: true
    },
    listFavo: {
        type: Array,
        default: [],
        require: false,
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
        delete returnedObject.typeAccount
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User