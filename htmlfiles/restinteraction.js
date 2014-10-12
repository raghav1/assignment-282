function createRequest() {
  var result = null;
  if (window.XMLHttpRequest) {
    // FireFox, Safari, etc.
    result = new XMLHttpRequest();
   
  }
  else if (window.ActiveXObject) {
    // MSIE
    result = new ActiveXObject("Microsoft.XMLHTTP");
  } 
  else {
    // No known mechanism -- consider aborting the application
  }
  return result;
}
// creating ajax calls

function login(){

var username=encodeURIComponent(document.getElementById("Username").value);
var pass=encodeURIComponent(document.getElementById("pass").value);
var parameters="username="+username+"&pass="+pass;
var req = createRequest(); // defined above
// Create the callback:

  req.open("POST", "/user/login", true);

req.setRequestHeader("Content-Type",
                     "application/x-www-form-urlencoded");

req.send(parameters);
req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
   
    localStorage.setItem('data',req.responseText);
    alert(JSON.parse(localStorage.getItem('data')).id);
    window.location="main.html"
  }
  // ... and use it as needed by your app.
}
}

function create(){

var firstname=encodeURIComponent(document.getElementById("Firstname").value);
var lastname=encodeURIComponent(document.getElementById("Lastname").value);
var username=encodeURIComponent(document.getElementById("username").value);
var password=encodeURIComponent(document.getElementById("password").value);
var parameters="username="+username+"&pass="+password+"&Firstname="+Firstname+"&Lastname="+Lastname;
var req = createRequest(); // defined above
// Create the callback:

  req.open("POST", "/user/signup", true);

req.setRequestHeader("Content-Type",
                     "application/x-www-form-urlencoded");

req.send(parameters);
req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
   
    window.location="main.html"
  }
  // ... and use it as needed by your app.
}
}

function getCatalog(){

var req = createRequest(); // defined above
// Create the callback:

  req.open("GET", "/user/catalog", true);

req.send();


req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
    var data=JSON.parse(req.responseText);
   var output="<ul>";
for (var i in data.Items) {
    output+="<li style='display:inline; margin:20px 50px;'><a href='/Catalog?q="+data.Items[i].name+"' >" + data.Items[i].name+"</a></li>";
}

output+="</ul>";
document.getElementById("catalog").innerHTML=output;
    //window.location="main.html"
  }
  // ... and use it as needed by your app.
}
}
// all items
function getitems(){

var req = createRequest(); // defined above
// Create the callback:

  req.open("GET", "/user/item", true);

req.send();


req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
    var data=JSON.parse(req.responseText);
   var output="";
for (var i in data.Items) {

    output+="<div class='abc'>"+"Name:"+ data.Items[i].name+"  </br>Quantity: " +data.Items[i].quantity+ " </br>Cost: "+data.Items[i].cost+"<p><input type='button' value='Add to Cart'></input> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   <input type='button' value='View Order' /></p></div> </br>";
}


document.getElementById("Allitems").innerHTML=output;
    //window.location="main.html"
  }
  // ... and use it as needed by your app.descripti
}
}


function getItemsInCatalog(name)
{

var req = createRequest(); // defined above
// Create the callback:

  req.open("GET", "/user/"+name, true);

req.send();


req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
    var data=JSON.parse(req.responseText);
    var output="";
   for (var i in data.Items) {
    output+="<div class='abc1'>" +"Name:"+data.Items[i].name+"  </br>Quantity: " +data.Items[i].quantity+ " </br>Cost: "+data.Items[i].cost+"<p><input type='button' value='Add to Cart'></input> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  <input type='button' value='View Order'/></p></div> </br>";// logic for getting things
}
document.getElementById("catalog").innerHTML=output;
    //window.location="main.html"
  }
  // ... and use it as needed by your app.
}
}

// Add item

function additem(){

var name=encodeURIComponent(document.getElementById("name").value);
var description=encodeURIComponent(document.getElementById("description").value);
var catalog=encodeURIComponent(document.getElementById("catalog").value);
var quantity=encodeURIComponent(document.getElementById("quantity").value);
var cost=encodeURIComponent(document.getElementById("cost").value);

var parameters="&name="+name+"&description="+description+"&catalog="+catalog+"&quantity="+quantity+"&cost="+cost;
var req = createRequest(); // defined above
// Create the callback:

  req.open("POST", "/user/item", true);

req.setRequestHeader("Content-Type",
                     "application/x-www-form-urlencoded");

req.send(parameters);
req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;
  console.log(resp);

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert(JSON.parse(req.responseText).message);

    window.location="main.html"

  }
  else{
   alert("Error");
  }
  // ... and use it as needed by your app.
}
}

// Payment

function pay(){

var amount=encodeURIComponent(document.getElementById("amount").value);
var cardno=encodeURIComponent(document.getElementById("cardno").value);


var parameters="&amount="+amount+"&cardno="+cardno;
var req = createRequest(); // defined above
// Create the callback:

  req.open("POST", "/user/payment", true);

req.setRequestHeader("Content-Type",
                     "application/x-www-form-urlencoded");

req.send(parameters);
req.onreadystatechange = function() {
  if (req.readyState != 4) return; // Not there yet
  if (req.status != 200) {
    // Handle request failure here...
    return;
  }
  // Request successful, read the response
  var resp = req.responseText;
  console.log(resp);

  if(JSON.parse(req.responseText).message!=undefined)
  {
    alert("asdasadsasgin");

  }
  else{
   
    alert("Thanks For Shopping With Us")
    window.location("main.html")
  }
  // ... and use it as needed by your app.
}
}




