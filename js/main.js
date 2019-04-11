var utdanning = 'http://wildboy.uib.no/~tpe056/folk/85432.json'

function queryWildboy(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        };
    };
    xhr.send();
};

function Dataset(url) {
    var data = queryWildboy(url, function(responseText) {
        console.log(responseText)
        this.data = responseText
    });
    this.getNames =  function() {
        return this.data['elementer'];
    };
    this.getIDs = function() {
        return null;
    };
    this.getInfo = function() {
        return null;
    };
    this.load = function() {
        return null;
    };
    this.onload = null;
};


var obj = new Dataset(utdanning);
console.log(obj.data)
