var socket = io.connect();
//var event_handler = require('./clientside_io.js');
var button1= document.getElementById('button1');          // send button for user1
var button2= document.getElementById('button2');          // send button for user2
var message1= document.getElementById('message1');        // text message written by user1
//var message2= document.getElementById('message2');        // text message written by user2
var showmsg2= document.getElementById('msg1');            // text message shown for user2
var showmsg1= document.getElementById('msg2');            // text message shown for user1
var tuser1= document.getElementById('tuser1');            // user1 is typing
var tuser2= document.getElementById('tuser2');            // user2 is  typing
var url = window.location.pathname;


//console.log('hello');
button1.addEventListener('click',function(){
	//console.log(message1.value);
	email = url.slice(10);
	socket.emit('personalmsg',{data : email,data1 :message1.value});
	//event_handler();
	message1.value=' '; 
});


socket.on('personalmsg1',function(msg){
	      msg1.innerHTML+='<br>'+msg.data;
	});