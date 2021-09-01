const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const userS = [], userI = [];
var nodemailer = require('nodemailer');

// app.use('/peerjs', peerServer); //peerjs server living in express and runing at different ports

app.set('view engine', 'ejs');
app.use(express.static('public'));

 app.get('/', (req, res) =>{
	res.render('front');  //render the front page
 })
 app.get('/login.ejs', (req, res) =>{
	res.render('login');  //render the login page
 })
 
 app.get('/chat', (req, res) =>{
	res.redirect(`/${uuidV4()}`);  //send uuid to client address bar 
 })

app.get('/:room', (req, res) =>{
	let addRoomId = req.params.room;
    console.log(addRoomId);
	res.render('room',{roomId: `${addRoomId}` }); //get id from address bar and send to ejs
})

io.on('connection', (socket, yourName )=>{
	//code to disconnect user using socket simple method ('join-room')
	socket.on('join-room',(roomId, userId, yourName) =>{
	
		userS.push(socket.id);
		userI.push(userId);
		//console.log("room Id:- " + roomId,"userId:- "+ userId);    //userId mean new user 
		
		//join Room
		console.log("room Id:- " + roomId,"userId:- "+ userId);    //userId mean new user 
		socket.join(roomId);                                       //join this new user to room
		socket.to(roomId).broadcast.emit('user-connected',userId, yourName); //for that we use this and emit to cliet	
		
		//Remove User
	    socket.on('removeUser', (sUser, rUser)=>{
	    	var i = userS.indexOf(rUser);
	    	if(sUser == userI[0]){
	    	  console.log("SuperUser Removed"+rUser);
	    	  socket.to(roomId).broadcast.emit('remove-User', rUser);
	    	}
	    });

		//code to message in roomId
		socket.on('message', (message,yourName) =>{
			io.to(roomId).emit('createMessage',message,yourName);
		})

	    socket.on('disconnect', () =>{
	    	//userS.filter(item => item !== userId);
	    	var i = userS.indexOf(socket.id);
	    	userS.splice(i, 1);
            socket.to(roomId).broadcast.emit('user-disconnected', userI[i]);
            //update array
           
            userI.splice(i, 1);
	    });
	    socket.on('seruI', (yourName) =>{
			console.log(yourName);
	    	io.to(roomId).emit('all_users_inRoom', userI);
			
		    //console.log(userI);
	    });  
		socket.on('mailer', (mail,yourName,loc) =>{
			console.log(mail);
	    	var transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
      				port: 465,
      				secure: true,
				service: 'gmail',
				auth: {
				  user: 'noreply.vchat@gmail.com',
				  pass: ''
				}
			  });
			  
			  var mailOptions = {
				from: 'noreply.vchat@gmail.com',
				to: mail,
				subject: 'Sending Email using Node.js',
				text: 'You have been invited by ' + yourName + " to join a meeting link: " + loc
			  };
			  
			  transporter.sendMail(mailOptions, function(error, info){
				if (error) {
				  console.log(error);
				} else {
				  console.log('Email sent: ' + info.response);
				}
			  });
	    }); 
	})
	
})


server.listen(process.env.PORT || 3000, () =>{
	console.log("Serving port 3000")
}); 