var tasksRow=$(".tasks_row");
var token=""; 

// Initialize Firebase
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
function requestPerm(){
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  return  messaging.getToken();
}).then(function(currentToken) {
    if (currentToken) {
        token=currentToken;
        console.log(currentToken);
        firebase.database().ref('/fcmTokens').child(currentToken)
          .set("1234");
//      sendTokenToServer(currentToken);
//      updateUIForPushEnabled(currentToken);
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
//      updateUIForPushPermissionRequired();
//      setTokenSentToServer(false);
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  }).catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});
}

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // ...
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});


messaging.onMessage(function(payload){
       
        $(".box .header").removeClass("big");
        $(".main-box").css("height",'440px');
    console.log("onMessages : ",payload);
    generateMessages(JSON.parse($("#json").val().replace(/",\n"/g,'","')));
        $(".ready-btn").text("Conversation On !");
})



function sendDemoNotification(){
    console.log(JSON.parse($("#json").val().replace(/",\n"/g,'","')));
    $.ajax({  
    type:'POST',
    url:'https://fcm.googleapis.com/fcm/send',
    headers:{
 Authorization:'key=AAAAo8NKsno:APA91bFdpPlxpczFL-XiuJuFoJWkoNJZn9pFrPhR1QhpPOogSxERP5Ep2WwsSYwg8KYKW3Z60SOpg3sq4T7LryXUcNiy7EaZYBOxZDpgJWGWUQco0qxatNHYS_NncLauu5Qy8-cIrsDl',
            },
    contentType:'application/json',
    data:JSON.stringify({
   "notification":JSON.parse($("#json").val().replace(/",\n"/g,'","')),
   "to":token
 }), success:function(data){
         console.log(data);
        },
        error:function(err,_,xhr){
            console.log(xhr);
        }
    });
}





$(document).ready(function(){
    $(".ready-btn").click(function(){
        $(".box .header").removeClass("big");
        $(".main-box").css("height",'440px');
    requestPerm();
    $("#admin-btn").show();
    });

    $("#json").text(JSON.stringify(sampleJson).replace(/","/g,'",\n"'));
    manageResize();
});

function manageResize(){
    
    if($(window).height()> $(".box").height() )
        $(".box").css("margin-top",parseInt(($(window).height()-$(".box").height())/2)+"px"); 
}

function generateMessages(obj){
    tasksRow.css("display","flex");
    var arr=obj.message.attachment.payload.elements;
if(tasksRow[0].childElementCount==0)
for(var x=0;x<arr.length;x++){
    tasksRow.append(getBox(arr[x]));
}   }


function getBox(obj){
    var x='<div class="col-xs-4"><div class="thumbnail"><div class="logo"><img src="'+obj.image_url+'" alt="" class="img-responsive"></div><div class="info"><p class="title">'+obj.title+'</p><p class="desc">'+obj.subtitle+'</p>';
    for(var i=0;i<obj.buttons.length;i++){
        x+=' <button class="btn-user">'+obj.buttons[i].title+'</button>'
    }
    x+='</div></div></div>';
    return x;
}