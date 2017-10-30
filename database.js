var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatapp1_database',function(err,res){
	if(err)
	{
		console.log('error in connecting to database');
	}
	else{
		console.log('connected to database');
	}
});

// login schema
var userSchema = mongoose.Schema({
	Email : {
		type : String,
		required : true,
		trim : true},
	Name : {
		type : String,
		required : true,
		trim:true
	},
	Password :{
		type : String,
		required : true
	},
});

var User = mongoose.model('users',userSchema);

var online =  mongoose.Schema({
	socket_id :{
		type : String,
		required : true
	},
	username :{
		type : String,
		required : true
	},
	email :{
		type : String,
		required : true
	}
});

var OnlineUser = mongoose.model('OnlineUser',online);

exports.User = User;
exports.OnlineUser = OnlineUser;