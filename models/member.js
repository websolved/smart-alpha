const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dealsin: {
        type: String,
        required: false
    },
    profileimage: {
        type: Buffer,
        required: true
    },
    profileImageType: {
        type: String,
        required: true
    },
    gst: {
        type: String,
        required: true
    },
    gstimg: {
        type: Buffer,
        required: true
    },
    gstImgType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

memberSchema.virtual('profileImagePath').get(function() {
    if (this.profileimage != null && this.profileImageType != null) {
        return `data:${this.profileImageType};charset=utf-8;base64,${this.profileimage.toString('base64')}`
    }
})

memberSchema.virtual('gstImagePath').get(function() {
    if (this.gstimg != null && this.gstImgType != null) {
        return `data:${this.gstImgType};charset=utf-8;base64,${this.gstimg.toString('base64')}`
    }
})

module.exports = mongoose.model('Member', memberSchema)