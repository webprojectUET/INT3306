const mongoose = require('mongoose')
const { default: Config } = require('../../config')

const realEstateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    note: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    pricePer: {
        type: String,
        require: true
    },
    electricPrice: {
        type: Number,
        require: true
    },
    waterPrice: {
        type: Number,
        require: true
    },
    typeRealEstate: {
        type: String,
        require: true
    },
    size: {
        type: Number,
        require: true,
        index: true,
    },
    state: {
        type: String,
        require: true,
        index: true
    },
    district: {
        type: String,
        require: true,
        index: true
    },
    addressDetail: {
        type: String,
        require: true
    },
    features: {
        type: Array,
        require: true
    },
    imagePath: {
        type: Array,
        require: true
    },
    userId: {
        type: String,
        require: true,
        index: true
    },
    createTime: {
        type: Number,
        require: true
    },
    bedroom: {
        type: String,
        require: true
    },
    bathroom: {
        type: String,
        require: true
    },
    isPrivate: {
        type: String,
        require: true
    },
    kitchenDetail: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: Config.DEFAULT_STATUS
    },
    isApprove: {
        type: Number,
        requie: true,
        default: Config.WAIT_APPROVE
    },
})

realEstateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const RealEstate = mongoose.model('RealEstate', realEstateSchema)

module.exports = RealEstate