const express=require('express');
const router=express.Router();
const userList=require('../../controllers/userList');

router.post('/register',userList.registerUser);
router.post('/login',userList.loginUser);

module.exports=router;