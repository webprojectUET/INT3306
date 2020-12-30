const mongoose = require('mongoose')
const Config = require('../../config')

const notifySchem = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        index: true
    },
    message: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    createTime: {
        type: Number,
        require: true
    },
    path: {
        type: String
    }
})

notifySchem.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
        delete returnedObject.typeAccount
    }
})

const Notify = mongoose.model('Notify', notifySchem)

module.exports = Notify