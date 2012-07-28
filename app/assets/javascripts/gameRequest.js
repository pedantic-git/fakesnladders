function GameRequest() {
}

// callback is a single-arg function that will be passed the array of of users
GameRequest.prototype.getAllUsers = function(callback) {
    var url = "/api/users";
    var reqCallback = function(response) {
      callback(response);
    };
    this.sendRequest("GET", url, null, reqCallback);
}

// callback is a function that will be passed the userId, their icon url, and current square
GameRequest.prototype.getCurrentUser = function(callback) {
    var url = "/api/users/me";
    var reqCallback = function(response) {
        callback(response.id, response.avatar_url, response.position);
    };
    this.sendRequest("GET", url, null, reqCallback);
}

// if supplied, optionalCallback will be passed the userId and updated square
GameRequest.prototype.updateUserSquare = function(userId, newSquare, optionalCallback) {
    var url = "/api/users/"+userId;
    var reqCallback = function(response) {
        if(optionalCallback) {
            optionalCallback(response.id, response.position);
        }
    };
    this.sendRequest("PUT", url, {"position": newSquare}, reqCallback);
}

// callback will be passed the question id, option a, and option b
GameRequest.prototype.getNewChoice = function(topic, callback) {
    var url = "/api/choices/new";
    var reqCallback = function(response) {
        callback(response.id, response.option_a, response.option_b);
    };
    this.sendRequest("GET", url, {"topic": topic}, reqCallback);
}

// callback will be passed true if question was answered correctly, else false
// choice parameter should be 'a' or 'b'
GameRequest.prototype.checkChoice = function(questionId, choice, callback) {
    var url = "/api/choices/"+questionId;
    var reqCallback = function(response) {
        var correct = (response.answer === "real");
        callback(correct);
    };
    this.sendRequest("PUT", url, {"option": choice}, reqCallback);
}

// callback will take a single request respose object
GameRequest.prototype.sendRequest = function(method, url, sendObject, callback) {
    var req = new XMLHttpRequest();

    req.open(method, url);
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if(req.status === 200) {
                eval("var resp = " + req.response); // ick
                callback(resp);
            } else {
                alert("Error: ready but status was " + req.statusText);
            }
        }
    };
    req.setRequestHeader("Content-Type", "application/json");
    req.send(sendObject);
}

