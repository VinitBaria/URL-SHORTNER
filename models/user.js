const mongooshe = require('mongoose');

const userSchema = new mongooshe.Schema({
    name :{
        type:String,
        required:true   
    },
    email:{
        type:String,
        required:true,
        unique:true
    },Role:{
        type:String,
        enum:['Admin','Normal'],
        default:'Normal'
    },
    password:{
        type:String,
        required:true
    }},{
        timestamps:true
    });

const User = mongooshe.model('User', userSchema);

module.exports = User;