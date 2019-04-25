var befolkning = 'http://wildboy.uib.no/~tpe056/folk/104857.json'
var sysselsatte = 'http://wildboy.uib.no/~tpe056/folk/100145.json'
var utdanning = 'http://wildboy.uib.no/~tpe056/folk/85432.json'


function Datasett(url) {
    this.url = url;
    this.getNames =  function() {
        var names = [];
        for (var elem in this.response.data['elementer']){
            names.push(elem);
        };
        return names;
    };
    this.getIDs = function() {
        var id = [];
        for (var elem in this.response.data['elementer']){
            id.push(this.response.data[elem]['elementer']['kommunenummer']);
        }
        return id;
    };
    this.getInfo = function() {
        alleKommuneNavn = this.getNames()
        alleKommuner = {}
        for (var i = 0; i < alleKommuneNavn.length; i++){
            alleKommuner[alleKommuneNavn[i]] = KommuneInfo(alleKommuneNavn[i])
        };
        return alleKommuner
    };
    this.load = function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.data = JSON.parse(xhr.responseText);
            };
        };
        xhr.send();
        this.response = xhr;
    };
    this.onload = null;
};

function KommuneInfo(kommune) {
    var befolkning = {
        menn: obj.response.data['elementer'][kommune]['Menn'],
        kvinner: obj.response.data['elementer'][kommune]['Kvinner'],
        total: function(år) {
            return this.menn[år] + this.kvinner[år]
            }
    };
    return befolkning
};


var obj = new Datasett(befolkning);
obj.load();


