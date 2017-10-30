var express = require('express');
var app = new express();
var path = require('path')
var User = require('./database.js').User;
var OnlineUser = require('./database.js').OnlineUser;
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var connection = [];
var online = [];
var session = require('express-session');
var pug = require('pug');
var name,username;

//database

// set method
app.set('view engine', 'pug');


OnlineUser.find().remove(function(err){
	if(err)
	{console.log(err);}
});


// use method
app.use(express.static(path.join(__dirname, 'client')));
app.use('/messages',express.static(path.join(__dirname, 'client')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
	resave : false,
	saveUninitialized : false
}));


//routes

app.get('/register',function(req,res){
	res.sendFile('G:/chat app/server/register.html');
});

app.get('/',function(req,res){
	res.sendFile('G:/chat app/server/login.html');
});


app.post('/login',function(req,res){
	var email = req.body.username;
	var password = req.body.password;
	console.log(req.username)
	User.find({'Email':email,'Password':password},function(err,result){
		if(err)
		{
			console.log(err);
		}
		else{
			if(Object.values(result).length){
			req.session.Email = email;
			req.session.Name = result[0].Name;
            username = email;			
            var x = email.slice(0,email.indexOf('@'));			
			name = result[0].Name;
			res.redirect('/'+x);
			}
			else{
				res.send(('invalid username or password'));
			}
		}
	});
});

app.get('/user',function(req,res){
	User.find(function(err,users){
		res.send(users);
	});
});
app.get('/online',function(req,res){
	OnlineUser.find({},function(err,users){
		res.send(users);
	});
});

app.get('/logout',function(req,res){
	removeusername(req.session.Email);
	req.session.destroy(function(err){
		if(err)
		{
			console.log(err);
		}
		res.redirect('/');
		
	})
	
});

app.get('/:username',function(req,res){
	res.sendFile(path.join(__dirname,'test.html'));}
);

app.get('/messages/:username',function(req,res){
	res.sendFile(path.join(__dirname,'message.html'));}
);

app.post('/register_data',function(req,res){
	console.log(req.body.email_address);
	var new_user = new User();
	new_user.Email = req.body.email_address;
	new_user.Name = req.body.name;
	new_user.Password = req.body.password;	
	new_user.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log('data is saved in database');
			res.redirect('/');
		}
	});
});

server.listen(3000,'0.0.0.0',function(){
	console.log('running at port 3000');
})


//sockets
 
 
io.on('connection',function(socket){           //  socket argument is for 1 socket connection
    connection.push(socket);  	               // io is for group of sockets
	console.log('connection created');
    console.log("%s sockets are connected",connection.length);
	addOnlineUser(socket.id)
	
	socket.on('new user',function(){
		socket.broadcast.emit('new_user',{print:name +' in chat room'});
	});
    socket.on('message1',function(data){
		io.emit('message1',{message:data.message})
	});
	
	socket.on('disconnect',function(){
		//console.log(socket.id + 'is offline')
		socket.broadcast.emit('leave',{print:name +' has leave chat room'});
		connection.pop();
		removeuser(socket.id)
	});
	
	socket.on('personalmsg',function(msg){
		socketid = search(msg.data); 		
		//console.log(socketid);
		socketid.then(function(socketid){
			console.log(socketid);
		socket.broadcast.to(socketid).emit('personalmsg1', {data : msg.data1});
        }).catch(function(err){
			console.log(err);
		})
		//socket.broadcast.to(socketid).emit('personalmsg1', {data : msg.data1});
	});
});

function addOnlineUser(id){
	var user = new OnlineUser();
	user.socket_id = id;
	user.username = name;
	user.email = username;
	user.save(function(err){
		if(err)
		{
			console.log(err);
		}
	});
}

function removeuser(id){
	OnlineUser.find({socket_id : id}).remove(function(err){
		if(err)
		{
			console.log(err)
		}
	});
}
function removeusername(Email){
	OnlineUser.findOne({email : Email}).remove(function(err){
		if(err)
		{
			console.log(err)
		}
	});
}

function search(data)
{
	return new Promise((resolve, reject) => {
		var x;
		OnlineUser.findOne({email : data +'@gmail.com'},'socket_id',function(err,result){
			if(err)
			{
				console.log(err)
			}
			x = result;
			if(x == null){
				reject(x);
			}
			else{
				resolve(x);
			}
		});
	})
}