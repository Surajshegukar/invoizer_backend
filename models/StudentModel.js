const mongoose = require('mongoose');
const { create } = require('./UserModel');

const StudentSchema = new mongoose.Schema({
   
    studentName:{
        type: String,
        required: [true, 'Student name is required']
    },
    studentContact:{
        type: Number,
        required: [true, 'Student contact is required']
    },
    studentID:{
        type: String,
        required: [true, 'Student ID is required']
    },
    studentClass:{
        type: Number,
        required: [true, 'Student class is required']
    },
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});

module.exports = mongoose.model('Student', StudentSchema);

