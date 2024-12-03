// path: /routes/auth/router.js

const express = require('express')
const bcrypt = require('bcryptjs')
const UserModel = require('../../models/UserModel')
const sendEmail = require('../../utils/sendEmail')

const jwt = require('jsonwebtoken')
const router = express.Router()


require('dotenv').config()



router.post('/register', async(req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:'Please provide name,email and password'
            });
        }

        const checkUser = await UserModel.findOne({
            email
        });

        if(checkUser){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);



        const user = await UserModel.create({
            name,
            email,
            password:hashedPassword
        });

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE
        });

        
        return res.status(201).json({
            success:true,
            message:'User created successfully',
            data:{
                "Name":user.name,
                "Email":user.email,
                "Role":user.role
            },
            token:token
        });


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
    })

router.post('/get-user', async(req,res) => {
    const {email} = req.body;

    try{

        const user = await UserModel.findOne({
            email
        });

        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }

        return res.status(200).json({
            success:true,
            data:{
                "Name":user.name,
                "Email":user.email,
                "Role":user.role,
                "password":user.password
            }
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });

    }
    }
)

router.post('/login', async(req,res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
        }
    
        const user = await UserModel.findOne({ email }).select('+password');
    
        if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Invalid credentials',
        });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
        return res.status(404).json({
            success: false,
            message: 'Invalid credentials',
        });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });


        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: token,
        });
    
        
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    })

router.post('/logout', async(req,res) => {
    res.send('Logout route')
    })

router.post('/forgotpassword', async(req,res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email',
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000);

        user.resetPasswordToken = resetToken;

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: message,
            });

            return res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email}`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    }
)

router.put('/resetpassword/:resetToken', async(req,res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token',
            });
        }

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide password',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Password updated successfully',
            
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    }
)

router.get('/get-all-users', async(req,res) => {
    try {
        const users = await UserModel.find();

        return res.status(200).json({
            success:true,
            data:users
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
    }
)

router.put('/update-user/:id', async(req,res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }

        return res.status(200).json({
            success:true,
            data:user
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
    }
)



module.exports = router
