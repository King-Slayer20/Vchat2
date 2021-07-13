const socket = io('/');  //socket connection
const videoGrid = document.getElementById('video-grid');
const userDropDown = document.getElementById('myDropdown');
const myVideo = document.createElement('video');
myVideo.muted = true;
let peers = {}, currentPeer = [];
let userlist = [];
let cUser;
let users = [];

let YourName = prompt("Please enter your name");
// function name(){
//   YourName = ;
//   if(YourName  === ""){
//     name();
//   }
// }

//window.onload = promalert();
// function promalert() {
//   swal({
//     title: "Enter your name",
//     content: {
//       element: "input",
//       attributes: {
//         placeholder: "Type your name",
//         type: "input",
//       },
//     },
//     showCancelButton: true,
//     closeOnConfirm: false,
//     animation: "slide-from-top",
//   }).then((inputValue) => {
//     if (inputValue == "") {
//       redo();
//     }
//     console.log(inputValue);
//     return inputValue;

//   });
// }
// function redo() {
//   swal({
//     title: "You must enter a name",
//     content: {
//       element: "input",
//       attributes: {
//         placeholder: "Type your name",
//         type: "input",
//       },
//     },
//     icon: "warning",
//     showCancelButton: true,
//     closeOnConfirm: false,
//     animation: "slide-from-top",
//   }).then((inputValue) => {
//     if (inputValue == "") {
//       redo();
//     }
//     console.log(inputValue);
//     return inputValue;

//   });
// }
// let YourName = promalert();

var peer = new Peer(undefined); //we undefine this because peer server create it's own user it

let myVideoStream;
navigator.mediaDevices.getUserMedia({     //by using this we can access user device media(audio, video) 
  video: true,
  audio: true
}).then(stream => {                        //in this promise we send media in stream
  addVideoStream(myVideo, stream);
  myVideoStream = stream;

  peer.on('call', call => {               //here user system answer call and send there video stream to us
    var acceptsCall = confirm("Videocall incoming");
    //users.push(YourName);
    if (acceptsCall) {
      console.log("answered");
      call.answer(stream);               //via this send video stream to caller
      const video = document.createElement('video');

      //for normal calls
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
      //currentPeer = call.peerConnection;
      currentPeer.push(call.peerConnection);
      // Handle when the call finishes
      call.on('close', function () {
        video.remove();
        alert("The videocall has finished");
      });
      // use call.close() to finish a call
    } else {
      console.log("Call denied !");
    }
  });

  socket.on('user-connected', (userId, user) => {   //userconnected so we now ready to share 
    users.push(user);
    console.log('user ID fetch connection: ' + userId); //video stream
    connectToNewUser(userId, stream);        //by this fuction which call user
  })

});


//if someone try to join room
peer.on('open', async id => {
  cUser = id;
  await socket.emit('join-room', ROOM_ID, id, YourName);
  users.push(YourName);

})

socket.on('user-disconnected', userId => {   //userdisconnected so we now ready to stopshare 
  if (peers[userId]) peers[userId].close();
  console.log('user ID fetch Disconnect: ' + userId);
  //by this fuction which call user to stop share
});


const connectToNewUser = (userId, stream) => {
  console.log('User-connected :-' + userId);
  users.push(YourName);
  let call = peer.call(userId, stream);       //we call new user and sended our video stream to him
  //currentPeer = call.peerConnection;
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);  // Show stream in some video/canvas element.
  })
  call.on('close', () => {
    video.remove()
  })
  //currentPeer = call.peerConnection;
  peers[userId] = call;
  currentPeer.push(call.peerConnection);
  console.log(currentPeer);
}


const addVideoStream = (video, stream) => {      //this help to show and append or add video to user side
  video.srcObject = stream;
  video.controls = true;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}

//to Mute or Unmute Option method
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setMuteButton();
  } else {
    setUnmuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setUnmuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
                <span>Mute</span>`;
  document.querySelector('.Mute__button').innerHTML = html;
  console.log("You are Unmuted");
}

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone-slash" style="color:red;"></i>
                <span>Unmute</span>`;
  document.querySelector('.Mute__button').innerHTML = html;
  console.log("Muted");
}

//Video ON or OFF
const videoOnOff = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    unsetVideoButton();
  } else {
    setVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setVideoButton = () => {
  const html = `<i class="fas fa-video"></i>
                <span>Stop Video</span>`;
  document.querySelector('.Video__button').innerHTML = html;
  console.log("Cammera Mode ON");
}

const unsetVideoButton = () => {
  const html = `<i class="fas fa-video-slash" style="color:red;"></i>
                <span>Start Video</span>`;
  document.querySelector('.Video__button').innerHTML = html;
  console.log("Cammera Mode OFF");
}

//code for disconnect from client
const disconnectNow = () => {
  window.location = "https://www.google.com/";
}

//code to invite using mail

let mail;
const invite = () => {
  let loc = window.location.href;
  
    swal({
      title: "Type the mail address",
      content: {
        element: "input",
        attributes: {
          placeholder: "email",
          type: "input",
        },
      },
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
    }).then((inputValue) => {
      if (inputValue == "") {
        email2();
      }
      mail = inputValue;

    });
    socket.emit('mailer', mail, YourName, loc);
  }
  function email2() {
    swal({
      title: "You must enter an email",
      content: {
        element: "input",
        attributes: {
          placeholder: "email",
          type: "input",
        },
      },
      icon: "warning",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
    }).then((inputValue) => {
      if (inputValue == "") {
        email2();
      }
      mail = inputValue;

    });
    socket.emit('mailer', mail, YourName, loc);
  }

//code to share url of roomId
const share = () => {
  var share = document.createElement('input'),
    text = window.location.href;

  //console.log("hardik");
  console.log(text);
  document.body.appendChild(share);
  share.value = text;
  share.select();
  document.execCommand('copy');
  document.body.removeChild(share);
  alert('Copied');
}
//msg sen from user
let text = $('input');

$('html').keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    socket.emit('message', text.val(), YourName);
    text.val('')
  }
});

//Print msg in room
socket.on('createMessage', (msg, user) => {
  $('ul').append(`<li class= "message"><small>~${user}</small><br>${msg}</li>`);
  //users.push(user);
  scrollToBottom();
});
// socket.on('aUser', (user) =>{
//   users.push(user);
// })

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}



const screenshare = () => {
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always',
      style: 'rotateY(180deg)'
    },
    audio: {
      echoCancellation: true,
      noiseSupprission: true
    }

  }).then(stream => {
    let videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = function () {
      stopScreenShare();
    }
    for (let x = 0; x < currentPeer.length; x++) {

      let sender = currentPeer[x].getSenders().find(function (s) {
        return s.track.kind == videoTrack.kind;
      })

      sender.replaceTrack(videoTrack);
    }

  })

}

function stopScreenShare() {
  let videoTrack = myVideoStream.getVideoTracks()[0];
  for (let x = 0; x < currentPeer.length; x++) {
    let sender = currentPeer[x].getSenders().find(function (s) {
      return s.track.kind == videoTrack.kind;
    })
    sender.replaceTrack(videoTrack);
  }
}

//raised hand
const raisedHand = () => {
  const sysbol = "&#9995;";
  socket.emit('message', sysbol, YourName);
  unChangeHandLogo();
}

const unChangeHandLogo = () => {
  const html = `<i class="far fa-hand-paper" style="color:red;"></i>
                <span>Raised</span>`;
  document.querySelector('.raisedHand').innerHTML = html;
  console.log("chnage")
  changeHandLogo();
}

const changeHandLogo = () => {
  setInterval(function () {
    const html = `<i class="far fa-hand-paper" style="color:"white"></i>
                <span>Hand</span>`;
    document.querySelector('.raisedHand').innerHTML = html;
  }, 3000);
}

//kick option
socket.on('remove-User', (userId) => {
  if (cUser == userId) {
    disconnectNow();
  }
});

const getUsers = () => {
  socket.emit('seruI', YourName);
}

const listOfUser = () => {
  userDropDown.innerHTML = '';
  while (userDropDown.firstChild) {
    userDropDown.removeChild(userDropDown.lastChild);
  }
  for (var i = 0; i < userlist.length; i++) {
    var x = document.createElement("a");
    var t = document.createTextNode(`${users[i]}`);
    x.appendChild(t);
    userDropDown.append(x);
  }
  const anchors = document.querySelectorAll('a');
  for (let i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', () => {
      console.log(`Link is clicked ${i}`);
      anchoreUser(userlist[i]);
    });
  }
}

const anchoreUser = (userR) => {
  socket.emit('removeUser', cUser, userR);
}


socket.on('all_users_inRoom', (userI, user) => {
  //users.push(user);
  console.log(userI);
  userlist.splice(0, userlist.length);
  userlist.push.apply(userlist, userI);
  console.log(userlist);
  listOfUser();
  document.getElementById("myDropdown").classList.toggle("show");
});