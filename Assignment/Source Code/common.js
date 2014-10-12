
function correctAns() {
    if(typeof(Storage) !== "undefined") {
        if (sessionStorage.correctAns) {
            sessionStorage.correctAns = Number(sessionStorage.correctAns)+1;
        } else {
            sessionStorage.correctAns = 1;
        }
	
        attemptedAns();
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
}
function attemptedAns() {
    if(typeof(Storage) !== "undefined") {
        if (sessionStorage.attemptedAns) {
            sessionStorage.attemptedAns = Number(sessionStorage.attemptedAns)+1;
        } else {
            sessionStorage.attemptedAns = 1;
        }
	
        
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
}

