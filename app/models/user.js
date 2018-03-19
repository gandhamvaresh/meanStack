// test edit
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        // arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'is not valid EMAIl.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'UserName should containes latters and numbers only'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];



var UserSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    username: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
    password: { type: String, required: true, validate: passwordValidator,select: false },
    email: { type: String, lowercase: true, required: true, unique: true, validate: emailValidator },
    active: {type: Boolean, required: true, default: false },
    temporarytoken: { type: String, required: true },
    resettoken: { type: String, required: false  },
    permission: {type: String, required: true, default: 'user'}
});

UserSchema.pre('save', function(next) {
    var user = this; 
 if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash; // Store hash in your password DB.
        next();

    });
});

UserSchema.methods.comparePassword = function(password) {
    // bcrypt.compareSync(myPlaintextPassword, hash); // true
    var user = this;
    return bcrypt.compareSync(password, user.password);

};

UserSchema.plugin(titlize, {
    paths: ['name']
});

/*bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});*/


module.exports = mongoose.model('User', UserSchema);


/*
var blogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});*/
