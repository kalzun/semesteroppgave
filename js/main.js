const allUrls = ["http://wildboy.uib.no/~tpe056/folk/104857.json", // Befolkning
				"http://wildboy.uib.no/~tpe056/folk/100145.json", // Sysselsatte
				"http://wildboy.uib.no/~tpe056/folk/85432.json", // Utdanning
			  ]

const KOMNR = "kommunenummer";
const MENN = "Menn";
const KVINNER = "Kvinner";
const BEGGE = "Begge kjønn";

const [GRUNNSKOLE,
	   VGS,
	   FAGSKOLE,
	   UNIKORT,
	   UNILANG,
	   UTENUTD] = ["01", "02a", "11", "03a", "04a", "09a"];

// Benytter Singleton-pattern, for å ha ett samlet objekt å forholde seg til ved spørringer.

AlleKommunerSingleton = (function() {
	let instance;
	const _IDs = [];
	const _IDs2 = [];
	const _IDs3 = [];
	const _names = [];
	const _all = [];
	const _inhabitants = [];
	const _employmentRates = [];
	const _education = [];
	let _loaded = false
	const _eduCodes = {
		"Grunnskolenivå": "01",
		"Videregående skole-nivå": "02a",
		"Fagskolenivå": "11",
		"Universitets- og høgskolenivå kort": "03a",
		"Universitets- og høgskolenivå lang": "04a",
		"Uoppgitt eller ingen fullført utdanning": "09a"};

	function init(){

		function setup(dataset) {

			/*
				Går gjennom alle tre datasettene og lager:
				alle ID-ene (kommunenummer)
				inhabitants (innbyggere)
				employmentrates (sysselsatte)
				education (utdanning)
			*/

			(function buildIds() {

				// Første datasett (innbyggere)
				// Her legger vi til alle ID vi finner.

				for (i in dataset[0].elementer){
					_inhabitants.push(dataset[0].elementer[i]);
					_IDs.push(dataset[0].elementer[i][KOMNR]);
					_names.push(i);
				}

				// Andre datasett (sysselsatte).
				// Her legger vi til all info om sysselsatte.
				// Men vi sjekker om ID allerede er lagt til, og legger IKKE til ID og navn til i så fall.

				for (i in dataset[1].elementer){
					_employmentRates.push(dataset[1].elementer[i]);
					_IDs2.push(dataset[1].elementer[i][KOMNR]);
					if (!_IDs.includes(dataset[1].elementer[i][KOMNR])){
						_IDs.push(dataset[1].elementer[i][KOMNR]);
						_names.push(i);
					}
				}

				// Tredje datasett (utdanning).
				// Her legger vi til alle info om utdanning.
				// Men vi sjekker om ID allerede er lagt til, og legger IKKE til ID og navn til i så fall.

				for (i in dataset[2].elementer){
					_education.push(dataset[2].elementer[i]);
					_IDs3.push(dataset[2].elementer[i][KOMNR]);
					if (!_IDs.includes(dataset[2].elementer[i][KOMNR])){
						_IDs.push(dataset[2].elementer[i][KOMNR]);
						_names.push(i);
					}
				}

				// Ved å ha IDs på alle datasett fordelt, kan vi sjekke forskjeller mellom dem.
				// Så vi bruker filter og include-metodene under, og finner IDer som ikke er i hvert datasett.
				// Konkret finner vi:
				// - kommunenummer 5061 ikke finnes i Utdanningsdatasett.
				// - det er flere kommunenummer i Utdanningsdatasett som ikke finnes i de andre datasettene.

				const diff1v2 = _IDs.filter(num => (!_IDs2.includes(num))); // Hvilke KOMNR i befolkning er ikke i sysselsetting?
				const diff1v3 = _IDs.filter(num => (!_IDs3.includes(num))); // Hvilke KOMNR i befolkning er ikke i utdanning?
				const diff2v3 = _IDs2.filter(num => (!_IDs3.includes(num))); // Hvilke KOMNR i sysselsetting er ikke i ?
				const diff3v1 = _IDs3.filter(num => (!_IDs.includes(num))); // Hvilke KOMNR i utdanning er ikke i sysselsetting?
				const diff3v2 = _IDs3.filter(num => (!_IDs2.includes(num))); // Hvilke KOMNR i utdanning er ikke i sysselsetting?

				// All true === alle IDene er med.
				// console.log("Integrity check :", diff1v2.every((num) => _IDs.includes(num)))
				// console.log("Integrity check :", diff1v3.every((num) => _IDs.includes(num)))
				// console.log("Integrity check :", diff2v3.every((num) => _IDs.includes(num)))
				// console.log("Integrity check :", diff3v1.every((num) => _IDs.includes(num)))
				// console.log("Integrity check :", diff3v2.every((num) => _IDs.includes(num)))



			}());

			// Oppretter alle kommuneobjektene, som vi samler i _all.
			// _all blir gjort offentlig tilgjengelige via funksjonen getAlleKommuner()
			for (id in _IDs){
				const _ = new Kommuneobj(_names[id], _IDs[id]);
				_all.push(_);
			}

		}

		function getEduCodes(name) {
			if (name) {
				return _eduCodes[name]
			}
			return Object.values(_eduCodes);
		}

		function getAlleKommuner() {
			return _all;
		}

		function getAllIDs(){
			return _IDs;
		}

		function getAllNames(){
			return _names;
		}

		function getID(name){
			for (n in _names){
				if (capFirstLetter(name) == _names[n])
					return _IDs[n];
			}
		}

		function getName(id){
			for (i in _IDs){
				if (id == _IDs[i])
					return _names[i];
			}
		}

		function getInfo(id){
			for (i in _all)
				if (id == _all[i].id)
					return _all[i];
			return "None found";
		}

		function getInhabitants(id){
			for (i in _inhabitants)
				if (_inhabitants[i][KOMNR] == id) return _inhabitants[i];
			return "Ingen tilgjengelige data.";
		}

		function getEmploymentRates(id){
			for (i in _employmentRates)
				if (_employmentRates[i][KOMNR] == id) return _employmentRates[i];
			return "Ingen tilgjengelige data.";
		}

		function getEducation(id){
			for (i in _education)
				if (_education[i][KOMNR] == id) return _education[i];
			return "Ingen tilgjengelige data.";
		}

		function getEduName(eduCode) {
			const categories = {
					"01": "Grunnskolenivå",
			    	"02a": "Videregående skole-nivå",
			    	"11": "Fagskolenivå",
			    	"03a": "Universitets- og høgskolenivå kort",
			    	"04a": "Universitets- og høgskolenivå lang",
			     	"09a": "Uoppgitt eller ingen fullført utdanning"
			    };
			if (eduCode) {
			    return categories[eduCode];
	    	}
	    	return categories;
		}

		function loaded(){
			_loaded = true
		}

		function isLoaded(){
			return _loaded
		}

		return {
			// Følgende metoder blir tilgjengelige utenfor singleton:
			setup: setup,
			getEduCodes: getEduCodes,
			getAlleKommuner: getAlleKommuner,
			getAllIDs: getAllIDs,
			getAllNames: getAllNames,
			getID: getID,
			getName: getName,
			getInfo: getInfo,
			getInhabitants: getInhabitants,
			getEmploymentRates: getEmploymentRates,
			getEducation: getEducation,
			getEduName: getEduName,
			loaded: loaded,
			isLoaded: isLoaded,
		}
	}

	return {
		// For å unngå å potensielt skape flere singletons
		getInstance: function() {
			if (!instance){
				instance = init();
			}
			return instance;
		}
	}
}())

function httpRequest(url, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.timeout = 10000;

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			callback(xhr.responseText);
			// Uncomment to test for latency:
			//setTimeout(() => {callback(xhr.responseText);}, 3000);
		}
	};

	xhr.onerror = () => {
		removeLoadingMessage();
		displayTimeoutMessage()
	}
	xhr.ontimeout = () => {
		removeLoadingMessage();
		displayTimeoutMessage()
	}
	xhr.send();
}

const DataSet = function(urls) {
	this.urls = urls;
	this.onload = null;

	this.getNames = function() {
		return this.singleton.getAllNames();
	}

	this.getIDs = function() {
		return this.singleton.getAllIDs();
	}

	this.load = function() {
		if (this.data) return "Data is already loading...";
		this.data = new Array();

		const timer0 = performance.now();
		httpRequest(this.urls[0], (response0) => { 			// Befolkning
			httpRequest(this.urls[1], (response1) => { 		// Sysselsatte
				httpRequest(this.urls[2], (response2) => {	// Utdanning
					this.data.push(JSON.parse(response0, rmvUnused));
					this.data.push(JSON.parse(response1, rmvUnused));
					this.data.push(JSON.parse(response2, rmvUnused));

					const timer1 = performance.now();
					console.log(`All datasets are loaded. It took approximately: ${timer1-timer0} milliseconds.`);

					const t2 = performance.now();
					this.singleton = AlleKommunerSingleton.getInstance();
					this.singleton.setup(this.data);
					this.singleton.loaded();
					const t3 = performance.now();

					console.log(`Datasets are setup in Singleton. It took approximately: ${t3-t2} milliseconds.`);

					if (this.onload) this.onload();

					// Konstruerer oversiktstabell
					constructTable(document.querySelector('.oversikt'), 'oversikt')
				});
			});
		});

		function rmvUnused(name, value) {
			// Removes "datasett" before parsing to object, since we will not use this, and we inform about the ownership a different place.
			if (name == "datasett") return undefined;
			else return value;
		}
	}

	this.getInfo = function(id) {
		return this.singleton.getInfo(id);
	}
}

const People = function(id) {
	this.setup()
	this.inhabitants = this._kommuner.getInhabitants(id);
	this.employment = this._kommuner.getEmploymentRates(id);
	this.education = this._kommuner.getEducation(id);

};

People.prototype = {
	setup: function(){
		this._kommuner = AlleKommunerSingleton.getInstance();
		return this._kommuner;
	},

	// INHABITANTS methods:

	getInhabitants: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];

		this.befolkningTotal = {};

		// Kontroller hvilke kjønn har flest målinger.
		this._biggest = Object.keys(this.inhabitants[MENN])
		if (Object.keys(this.inhabitants[KVINNER]).length > this._biggest.length) {
			for (year in this.inhabitants[KVINNER]){
				this.befolkningTotal[year] = this.inhabitants[MENN][year] + this.inhabitants[KVINNER][year];
			}
		} else {
			for (year in this.inhabitants[MENN]){
				this.befolkningTotal[year] = this.inhabitants[MENN][year] + this.inhabitants[KVINNER][year];
			}
		}
		return this.befolkningTotal;
	},

	getInhabitantsLastYearTotal: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return null;

		this.menn = this.inhabitants[MENN];
		this.kvinner = this.inhabitants[KVINNER];

		// Gå gjennom alle egenskapene i objektet, lagre alle keys i et array
		this.alleTallM = Object.keys(this.menn).sort();
		this.alleTallK = Object.keys(this.kvinner).sort();

		// Finner siste år i menn, ved å referere til lengden av alle tall - 1,
		// som tilsvarer siste element.
		this.sisteTallM = this.menn[this.alleTallM[this.alleTallM.length-1]];
		this.sisteTallK = this.kvinner[this.alleTallK[this.alleTallK.length-1]];

		return this.sisteTallM + this.sisteTallK;
	},

	// EMPLOYMENT methods:

	getEmploymentRates: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];

		return this.employment[BEGGE];
	},

	getEmploymentRatesLastYear: function() {
		if (isContentInCategory(this.employment)) return [];

		this.emp = this.employment[BEGGE];
		this.empAllNumbers = Object.keys(this.employment[BEGGE]).sort();
		this.empLastNumber = this.emp[this.empAllNumbers[this.empAllNumbers.length-1]];
		return this.empLastNumber;
	},

	getEmploymentRatesByGender: function(gender) {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];
		return this.employment[gender];
	},

	// EDUCATION methods:

	getEducationRatesLastYearSpecified: function(educode) {

		// Sjekk om vi har data på utdanning på kommunen.

		if (this.education == "Ingen tilgjengelige data."){
			this.edu == this.education;
			return 0;
		}

		this.edu = this.education[educode];
		this.eduMAllYears = Object.keys(this.edu[MENN]).sort();
		this.eduKAllYears = Object.keys(this.edu[KVINNER]).sort();
		this.eduLastYearM = this.edu[MENN][this.eduMAllYears[this.eduMAllYears.length-1]];
		this.eduLastYearK = this.edu[KVINNER][this.eduKAllYears[this.eduKAllYears.length-1]];

		return (this.eduLastYearM + this.eduLastYearK) / 2;
	},

	getEducationRates: function(edu){
		switch (edu) {
			case "grunnskole":
			case GRUNNSKOLE:
				return this.education[GRUNNSKOLE];
				break;
			case "VGS":
			case VGS:
				return this.education[VGS];
				break;
			case "fagskole":
			case FAGSKOLE:
				return this.education[FAGSKOLE];
				break;
			case "unikort":
			case UNIKORT:
				return this.education[UNIKORT];
				break;
			case "unilang":
			case UNILANG:
				return this.education[UNILANG];
				break;
			case "utenutdanning":
			case UTENUTD:
				return this.education[UTENUTD];
				break;
			default:
				return this.education;
				break;
		}

	}
};


let Kommuneobj = function(navn, id) {
	this.navn = navn;
	this.id = id;
	this.people = new People(id);
}

// Konstruerer dataset og singleton objekt for alle kommuner
const fullstendigDataSet = new DataSet(allUrls);
fullstendigDataSet.load();
const kommuneSingleton = AlleKommunerSingleton.getInstance();
