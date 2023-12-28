const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
const jwt= require("jsonwebtoken");
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    profilePath:{
        type:String,
        // required:true
    },

        token:{
            type:String,
            required:true
        }

})
// middleware
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10);
    }
    next();
    // console.log(this.password);
})


userSchema.methods.generateAuthToken =async function(){
    try{
        const token= jwt.sign({_id:this._id.toString()},"mynameisswikkicodes");
        console.log(token)
        this.token=token;
        await this.save();
        return token
    }
    catch(e){
        // res.send("the error part "+ e);
        console.log("the error part "+ e);

    }
}

const User= new mongoose.model("register",userSchema);

module.exports=User;