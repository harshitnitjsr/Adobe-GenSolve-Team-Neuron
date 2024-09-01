import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({

    username: {
        type: String,
        required: [true,"PLEASE PROVIDE A USERNAME"],
        unique: [true,"USERNAME IS ALREADY TAKEN"]
    },
    email: {
        type: String,
        required: [true,"PLEASE PROVIDE A email address"],
        unique: [true,"EMAIL IS ALREADY TAKEN"]

    },
    password: {
        type: String,
        required: [true,"PLEASE PROVIDE A PASSWORD"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken:String,
    verifyTokenExpiry: Date,
    
 
})

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;