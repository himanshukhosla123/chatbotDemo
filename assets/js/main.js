var firstname="",secondname="",chatBox=$(".chat-messages"),userInput=$("#user_message"),loggedEmail="",counter=-1;

var messageList=[];
    
$(document).ready(function(){
$("body").css("background-size",$(window).width()+"px "+$(window).height()+"px");

$(".toggle_bot_button").click(function(){
  $(".chat_bot").toggleClass("open");  
});

if(localStorage.length==0){
    
}  
else{
$(".chat_bot .fa").click();
    
var messges=localStorage.getItem('messages').length==0?[]:localStorage.getItem('messages');
chatGenerator(JSON.parse(messges));
loggedEmail=localStorage.getItem('email');
if(loggedEmail!=null){    
chatBox.append(botMessageTemp("Thank you for logging in.here's your email id."));
chatBox.append(getLoginButton(loggedEmail));
}
firstname=localStorage.getItem('firstname')==null?"":localStorage.getItem('firstname');
secondname=localStorage.getItem('secondname')==null?"":localStorage.getItem('secondname');    
}
    
checkForJoke();    
});

function checkForJoke(){
    if(firstname=="")
        chatBox.append(botMessageTemp("What is your first name ?"));
    else if(secondname=="")
        chatBox.append(botMessageTemp("And last name ?"));
    if(firstname!=""&&secondname!="")
        getJoke(firstname,secondname);
    console.log(firstname + ' '+ secondname);
} 

function userMessageTemp(message){  
    addToMessageList('user',message);
return '<div class="chat-msg chat-right"><div class="message_box"><span class="message">'+message+'</span></div></div>'; 
}   

function botMessageTemp(message){ 
    addToMessageList('bot',message);
return '<div class="chat-msg"><div class="message_box"><span class="message">'+message+'</span></div></div>'; 
}   

function chatGenerator(arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i].source=='user')
            chatBox.append('<div class="chat-msg chat-right"><div class="message_box"><span class="message">'+arr[i].message+'</span></div></div>');
        else if(arr[i].source=='bot')
            chatBox.append('<div class="chat-msg"><div class="message_box"><span class="message">'+arr[i].message+'</span></div></div>');
    }
}

function handleFormSubmit(){
    var message=userInput.val();
    if(message!="")
    {
        chatBox.append(userMessageTemp(message));
        actionMapper(message);
        userInput.val("");
    }
    return false;
}    

function actionMapper(message){
    if(firstname=="")
    {firstname=message;
    checkForJoke();}
     else if(secondname=="")
     {secondname=message;
     checkForJoke();}
     else if(message.toLowerCase()=="login please"){
         chatBox.append(botMessageTemp("Here's your login screem.<br>Click on the Button"));
         chatBox.append(getLoginButton('Button',"login.html"))
     }
     else if(firstname!=""&&secondname!="")
        checkForJoke();
     
}

function addToMessageList(role,message){
    var obj={source:role,
             message:message};
    messageList.push(obj);
    localStorage.setItem('messages',JSON.stringify(messageList));
             
    
}

function getJoke(){
   counter++;
    $.ajax({
       type:"get",
       url:'http://api.icndb.com/jokes/random?firstName='+firstname+'&lastName='+secondname,
        success:function(data){
          chatBox.append(botMessageTemp("Here's a joke on you."));
          chatBox.append(botMessageTemp(data.value.joke));
          if(counter<1)
          {
            localStorage.setItem("firstname",firstname);
           localStorage.setItem("secondname",secondname);
          } 
        },
        error:function(){
        alert("Error in getting jokes");
    }   
    });
}

function getLoginButton(text,link){
    if(link==undefined){
        link='javascript:void(0)';
    }
    return '<div class="text-center mb10"><a href="'+link+'" class="btn-user">'+text.toUpperCase()+'</a></div>'     
}