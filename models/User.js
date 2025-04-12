const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

//user Schema
const userSchema = new mongoose.Schema({
    firstName:{type :String,required:true},
    lastName:{type :String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{type:String,default:'user',enum:['admin','user']}
}, { timestamps: true });

userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.copmparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
module.exports = mongoose.model('User', userSchema);
