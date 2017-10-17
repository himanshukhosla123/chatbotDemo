importScripts("https://www.gstatic.com/firebasejs/4.5.2/firebase.js");
var config = {
    apiKey: "AIzaSyAUEztYHayc0K6gzTQ-llBKCnWZEXGdUrY",
    authDomain: "friendlychat-1234-ff4d2.firebaseapp.com",
    databaseURL: "https://friendlychat-1234-ff4d2.firebaseio.com",
    projectId: "friendlychat-1234-ff4d2",
    storageBucket: "friendlychat-1234-ff4d2.appspot.com",
    messagingSenderId: "703356121722"
  };

  firebase.initializeApp(config);

var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
    var title="hello world";
    var options={
        body:payload.data.status
    }
    return self.registration.showNotification(title,options);
});