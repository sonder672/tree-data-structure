const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true
    },
    nodeId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Node'
    }
}, { timestamps: true });

const userRegistrationLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    is_deleted: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema );
const UserRegistrationLogModel = mongoose.model('UserRegistrationLog', userRegistrationLogSchema );

module.exports = { UserModel, UserRegistrationLogModel };