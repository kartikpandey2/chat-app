var socket = io.connect();
socket.emit('new user');
var button1= document.getElementById('button1');          // send button for user1
var button2= document.getElementById('button2');          // send button for user2
var message1= document.getElementById('message1');        // text message written by user1
//var message2= document.getElementById('message2');        // text message written by user2
var showmsg2= document.getElementById('msg1');            // text message shown for user2
var showmsg1= document.getElementById('msg2');            // text message shown for user1
var tuser1= document.getElementById('tuser1');            // user1 is typing
var tuser2= document.getElementById('tuser2');            // user2 is  typing
var url = window.location.pathname;
var t  = document.getElementById('online_name');

//console.log('hello');
button1.addEventListener('click',function(){
	//console.log(message1.value);
	socket.emit('message1',{message:message1.value});
	message1.value=' '; 
	
});


socket.on('leave',function(data){//alert(data.print);
});


socket.on('new_user',function(data){
	//alert(data.print)
	});
socket.on('message1',function(data){
	msg1.innerHTML+='<br>'+data.message;
});

/*socket.on('deliver2',function(data){
	console.log('deliver2 event emitted');
	msg1.innerHTML+='<br>'+data.message;
});*/
function onlineuser(){
	var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     var object = JSON.parse(this.responseText);
	 showonlineuser(object);
    }
  };
  xhttp.open("GET", "http://localhost:3000/online", true);
  xhttp.send();
}

/*message1.addEventListener('keydown',function(){
	tuser2.innerHTML = '<i>'+'Typing'+'</i>';
});
/*message2.addEventListener('keydown',function(){
	tuser1.innerHTML = '<i>'+'Typing'+'</i>';
});
message1.addEventListener('keyup',function(){
	setTimeout(function(){console.log('keyup event got triggered')
	tuser2.innerHTML = ' ';},1000);
});*/

function showonlineuser(object)
{
	var text = "";
	for(i=0;i<object.length;++i)
	{
		if(object[i].email.slice(0,object[i].email.indexOf('@'))!== url.slice(1))
		{
		var a = document.createElement('a');
		var br = document.createElement('br');
		a.href = '/messages/'+ object[i].email.slice(0,object[i].email.indexOf('@'));
		a.appendChild(document.createTextNode(object[i].username));
		document.getElementById('showonlineusers').appendChild(a);
		document.getElementById('showonlineusers').appendChild(br);
		}
	}
}


	