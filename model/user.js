const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    birthday : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        default : './image/user.png'
    }
});

module.exports = mongoose.model('User', userSchema);