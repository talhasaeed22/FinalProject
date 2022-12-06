const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "thisiswebtokensecret";

var jwt = require('jsonwebtoken');


//Creating a user using POST /api/auth/signup request.
router.post('/signup', [
    body('email', 'Please Enter valid email').isEmail(),
    body('password', 'Password must be lenght of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let exist = await user.findOne({ email: req.body.email });
        if (exist) {
            return res.status(400).json({success,  error: "Sorry a user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        let newuser = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: newuser._id
            }
        }
        success = true
        const token = jwt.sign(data, JWT_SECRET);
        res.send({success:success, token:token, name:req.body.name, email:req.body.email});
    } catch (error) {
        res.status(500).send("Internal Server Error Occurred. Please Try Again.")
    }
})

//Route 2: Authenticate a user using POST using "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
] , async (req, res)=>{
    let success = false;
    //Is there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    //Req.body contains email and password so extracting them
    const {email, password} = req.body;
    try {
        let loggedinuser = await user.findOne({email})
        if(!loggedinuser){
            return res.status(400).json({success, error:"Please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, loggedinuser.password)
        if(!passwordCompare){
           return res.status(400).json({success, error:"Please try to login with correct credentials"})
        }
        //it is the data of user.... We will send the id of user
        const data = {
            user:{
                id:loggedinuser._id
            }
        }
        success = true;
        const token  = jwt.sign(data, JWT_SECRET);
        res.json({success:success, token:token, name:loggedinuser.name, email:loggedinuser.email});
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

// Route 3: Get user details using POST using "/api/auth/getuser"
router.post('/getuser', fetchuser , async (req, res)=>{
    try {
        const userID = req.User.id;
        const loggedinuser = await user.findOne({userID}).select("-password")
        res.send(loggedinuser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router