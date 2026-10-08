const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET || "abcd@1234";

async function  Setuser(user){
  return jwt.sign({user},secretkey);}


async function Getuser(id){
    if(!id) return null;    
    return jwt.verify(id,secretkey);
}
module.exports={
    Setuser,
    Getuser
};