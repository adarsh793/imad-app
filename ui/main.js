var button= document.getElementById('counter');
var counter=0;
button.onclick = function(){
    
    //Create a request object
    var request = new XMLHttpRequest();
    //capture the response and store it in a variable.
    request.onreadystatechange= function(){
        if(request.readyState=== XMLHttpRequest.DONE){
            //take some action
            if(request.Status==200){
                var counter = request.responseText;
                var span= document.getElementById('count');
                span.innerHTML= counter.toString();
            }
        }
        //not done yet
    };
    //make the request
    request.open('GET','adarsh793.imad.hasura-app.io',true);
    request.send('null');

};
