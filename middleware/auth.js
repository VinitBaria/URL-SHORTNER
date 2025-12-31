const { Getuser, Setuser } = require('../service/user');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


async function authenticateUser(req, res, next) {
  const uid = req.cookies?.uid;
  console.log(req.cookies);
  if (!uid) {
    return res.render("login", { message: "Please login first" }); 
  }

  try {
    const payload = await Getuser(uid);

    if (!payload || !payload.user) {
      return res.render("login", { message: "Please login first" }); 
    }

    // Fetch full user object from database to get Role and other fields
    const user = await User.findById(payload.user);
    
    if (!user) {
      return res.render("login", { message: "User not found. Please login again." }); 
    }

    req.user = user; // Set full user object with all fields including Role
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    return res.render("login", { message: "Invalid session. Please login again." }); 
  }
}

function restrictToRoles(allowedRoles=[]){
  return function(req,res,next){
    const userRole = req.user.Role;
    if(!userRole) return res.redirect('/login');
    if(!allowedRoles.includes(userRole)){
      return res.status(403).send({message:"Access denied"});
    }
    next();
  }
}

module.exports ={ authenticateUser,restrictToRoles};
