const mongoose = require('mongoose');
const express = require('express');

const StudentModel = require('../../models/StudentModel');

const router = express.Router();

const fetchUser = require('../../middleware/fetchUser');

router.get('/get-students',fetchUser, async(req, res) => {
    try{
        const students = await StudentModel.find({user: req.id});
        return res.status(200).json({
            success: true,
            message: 'Students fetched successfully',
            data: students
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.post('/add-student',fetchUser, async(req, res) => {
    try{
        const {studentName, studentContact, studentID, studentClass} = req.body;

        if(!studentName || !studentContact || !studentID || !studentClass){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const student = new StudentModel({
            studentName,
            studentContact,
            studentID,
            studentClass,
            user: req.id
        });

        await student.save();
        return res.status(200).json({
            success: true,
            message: 'Student added successfully',
            data: student
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
        
}
);

router.put('/update-student/:id',fetchUser, async(req, res) => {
    try{
        
        const isStudentExist =await StudentModel.findOne({_id: req.params.id});
        if(!isStudentExist){
            return res.status(400).json({
                success: false,
                message: 'Student not found'
            });
        }

        if(isStudentExist.user.toString() !== req.id){
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to update this student'
            });
        }


        const {studentName, studentContact, studentID, studentClass} = req.body;

        if(!studentName || !studentContact || !studentID || !studentClass){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updatedStudent = await StudentModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        return res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
);

router.delete('/delete-student/:id',fetchUser, async(req, res) => {
    try{
        const isStudentExist =await StudentModel.findOne({_id: req.params.id});
        if(!isStudentExist){
            return res.status(400).json({
                success: false,
                message: 'Student not found'
            });
        }

        if(isStudentExist.user.toString() !== req.id){
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to delete this student'
            });
        }

        await StudentModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
);

module.exports = router;

