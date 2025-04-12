const mongoose = require('mongoose');

//comments schema
const commentsSchema = new mongoose.Schema({
    text:{type:String,required:true},
    auther:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    date:{type:Date,default:Date.now}
}); 


//post schema
const postSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    content:{
        type:String,
        required:true,
        validate:{
            validator:(value)=> value.length >=10 && value.length <= 500,
            message:'Content must be between 10 and 500 characters'
        }
    },
    auther:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    tags:[String],
    comments:[commentsSchema],
},{timestamps:true});

module.exports = mongoose.model('Post',postSchema);