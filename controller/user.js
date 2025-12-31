const User = require('../models/user');
const{ Getuser,Setuser}=require('../service/user');
const { v4: uuid} = require('uuid');
const Item = require('../models/url');



async function createUser(req,res) {

   const body= req.body;
   await User.create({ 
    name: body.name,
    email: body.email,
    password: body.password
    });
    return  res.render("login",{
         message: "User created successfully"
   });
}
async function findUserByEmailAndPassword(req,res) {
  const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if(!user) return res.status(404).send({ message: "User not found" });
    const token = await Setuser(user._id);
    const cookieMaxAge = process.env.COOKIE_MAX_AGE || (1000 * 60 * 60 * 24 * 7);
    res.cookie("uid",token,{
    domain: "localhost",
    expires: new Date(Date.now() + parseInt(cookieMaxAge)), 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    });
    const allurl = await Item.find({createdby: user._id}); 
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
    const array = allurl.map(item => ({
        orgurl: item.orgurl,
        shortId: `${baseUrl}/${item.shortId}`,

    }));
      res.render('index', { array });
}   

module.exports = {
    createUser,
    findUserByEmailAndPassword
};
