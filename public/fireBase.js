var fireBase = fireBase || firebase;
var hasInit = false;
var firebaseConfig = {
  apiKey: "AIzaSyDPFJNGsdUR1eOL1r4uuKrJgLQdwEPKhOI",
  authDomain: "vchat-45eb7.firebaseapp.com",
  projectId: "vchat-45eb7",
  storageBucket: "vchat-45eb7.appspot.com",
  messagingSenderId: "368957076876",
  appId: "1:368957076876:web:fc791ada6c410db86152a9",
  measurementId: "G-9CLYQ6HMC6"
};
if(!hasInit){
    firebase.initializeApp(firebaseConfig);
    hasInit = true;
}


