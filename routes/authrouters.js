const express=require('express');
const {register,login,getAllUsers,userDetails} = require('../controller/authcontroller')
const authMiddleware=require('../middleware/authMiddleware')

const router=express.Router();

router.post('/register',register);
router.post('/login', login);
router.get('/userdetails', authMiddleware, userDetails);
router.get('/getallusers',getAllUsers)

module.exports = router