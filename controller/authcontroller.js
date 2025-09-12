
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User= require("../model/user");
// const user = require('../model/user');

//register and store passs as hash using bcrypt
exports.register = async (req,res) =>{
    try {
        const {userid,username,password} = req.body;

        if(!userid || !username || !password){
            return res.status(400).json({message: "All Fields Are Required"});
        }

        const exists = await User.findOne({username});
        if(exists){
            return res.status(400).json({message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS));

        const newUser = await User.create({
            userid,
            username,
            password: hashedPassword
        });

        const userobject = newUser.toObject();
        delete userobject.password;
        delete userobject._id;
        delete userobject.__v;

        res.status(201).json({message: "User Registered Sucessfully", user: userobject});
    }catch(error){
        res.status(500).json({message: "Server Error"})
        console.log(error);
    }
}

//login and genrate specific jwtoken
exports.login = async (req,res) =>{
    try{
    const {username , password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "All Fields are Required"})
    }

    const user= await User.findOne({username})
    if(!user){
        return res.status(400).json({message: "Invalid credentials"})
    }
    // console.log(user);
    const ismatch = await bcrypt.compare(password, user.password)
    if(!ismatch){
        return res.status(400).json({message: "Invalid credentials"})
    }

    const token = jwt.sign(
        {sub: user._id,  username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )
    res.json({Token: token});
    }catch(error){
        res.status(500).json({message: "Server Error"})
        // console.log(error);
    }
}

//get user detail by providing specific token - the token which given when login
exports.userDetails =async (req,res) => {
    try{
        const user= await User.findById(req.user.sub).select("-password -__v -_id");
        res.json(user);
    }
    catch{
        res.status(500).json("Server Error")
    }
}

//get all user in DB
exports.getAllUsers = async (req,res) =>{
    try {
        const users = await User.find().select("-password -__v -_id")

        res.json({
            message:"All Registered Users: ",
            Count: users.length,
            users,
        })
    }catch(error){
        res.status(500).json("Server Error");
    }
}