const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
    //Note: username and password is not here, passwordLocalMongoose will do automatically later. 
})

userSchema.plugin(passportLocalMongoose); //behind the scene, it will plugin username and password for us. 

const User = mongoose.model('User', userSchema);

module.exports = User; 
