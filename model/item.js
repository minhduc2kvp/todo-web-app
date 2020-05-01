const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    deadline : {
        type : String,
        required : true
    },
    colorStyle : {
        type : String,
        default : "royalblue"
    },
    check : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model('Item', itemSchema);