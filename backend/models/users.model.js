import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id:{
        type : String,
        unique : true,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    email :{
        type : String,
        unique : true,
        required : true,

    },
    phone : {
        type : String,
        required : true,
    },
    nic : {
        type : String,
        unique : true,
        required : true,
    },
    address :{
        type : String,
        required : true,
    },
    gender :{
        type: String,
        required : true
    },
    role : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required:true,
    }
},{timeStamps : true});


const User = mongoose.model("users",userSchema);

export default User;