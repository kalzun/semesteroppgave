document.addEventListener("DOMContentLoaded", function(event){
	const searchButtons = document.querySelectorAll(".searchbutton");
	for (let index = 0; index < 2; index++){
		searchButtons[index].addEventListener("click", search);
	}

	// Input-listener som sjekker for hver bokstav skrevet inn
	inputFields = document.querySelectorAll(".search");
	for (let i = 0; i < inputFields.length; i++){
		inputFields[i].addEventListener("input", regexChecker);
		inputFields[i].addEventListener("blur", function() {
			let clearThisOutput = clearOutput.bind(this);
			clearThisOutput();
			});
	}
});


// Kjøres når brukeren trykker på en søkeknapp
function search(suggestion){
	let kommunenr1,
		kommunenr2;

    const targetClass = event.target.id;
    let domElem = document.getElementsByClassName(targetClass)[0];
    const aParent = event.target.parentElement.parentElement;
    const alleInputs = aParent.querySelectorAll("div .search");

    fullstendigDataSet.onload = function(){
        switch (targetClass){
	    	case "detaljer":
	    		// Hvis bruker skriver inn kommunenavn:
				// Convert name to id
				(isNameInDataset(alleInputs[0].value)) ? kommunenr1 = kommuneSingleton.getID(alleInputs[0].value) : kommunenr1 = alleInputs[0].value;
	    		break;
	    	case "sammenligning":
	    		(isNameInDataset(alleInputs[0].value)) ? kommunenr1 = kommuneSingleton.getID(alleInputs[0].value) : kommunenr1 = alleInputs[0].value;
	    		(isNameInDataset(alleInputs[1].value)) ? kommunenr2 = kommuneSingleton.getID(alleInputs[1].value) : kommunenr2 = alleInputs[1].value;
	    		break;
    	};
		removeLoadingMessage()
        tabell(domElem, targetClass, kommunenr1, kommunenr2);
    }
    
    if (kommuneSingleton.isLoaded() == true) {
        fullstendigDataSet.onload();
    }else{
        displayLoadingMessage(domElem)
    }
}

function populateSearchField(content, inputElements, isSecondary) {
	let output;

	if (isSecondary) { // On sammenligning
		inputElements[1].value = content;
		output = inputElements[1].parentElement.querySelector(".search-output-right");
	} else {
		inputElements[0].value = content;
		output = inputElements[0].parentElement.querySelector(".search-output");
	}
	clearOutput(output);
}

function regexChecker(event){
	const names = kommuneSingleton.getAllNames();
	const IDs = kommuneSingleton.getAllIDs();
	let userInput = event.target.value;
	let regexp = new RegExp(`^${userInput}`, 'gi');
	let output;

	// Sjekk hvilken input som skrives inn i, for å bestemme hvor forslagene skal skrives ut:
	if (this.id === "input-sam2")
		output = this.parentElement.querySelector(".search-output-right");
	else
		output = this.parentElement.querySelector(".search-output");

	// Rensk output for hver inntasting (eller sletting):
	clearOutput(output);

	// Bare utfør sjekk dersom det står noe i feltet.
	if (userInput.length > 0){
		outputRegexHits(names.filter((name) => name.search(regexp) !== -1), output);
		outputRegexHits(IDs.filter((id) => id.search(regexp) !== -1), output);
	}
}

function clearOutput(output){
	if (output === undefined){

		// Sjekk hvilken id this har, for å kunne fjerne korrekt output
		// Må gjøres her siden vi har flere forskjellige outputs, og flere steder hvor output fjernes

		switch (this.id){
			case "input-det":
				output = document.querySelector(".search-output");
				break;
			case "input-sam1":
				output = document.querySelectorAll(".search-output")[1];
				break;
			case "input-sam2":
				output = document.querySelector(".search-output-right");
				break;
			default:
				output = document.querySelector(".search-output");
		}
	}
	while (output.firstChild) { // Fjerner alle barna til output
		output.removeChild(output.firstChild);
	}
}

function outputRegexHits(hits, output){
	const maxHitsShown = 5;
	hits.slice(0, maxHitsShown).forEach((hit) => {
		const li = document.createElement("li");
		let kommunenr, kommunenavn, kommuneinfo;
		if (Number(hit)){ 
			kommunenavn = kommuneSingleton.getName(hit);
			kommuneinfo = kommuneSingleton.getInfo(hit);
		} else {
			kommunenr = kommuneSingleton.getID(hit);
			kommuneinfo = kommuneSingleton.getInfo(kommunenr);
		}
		
		
		li.className = "search-suggestion";

		li.innerHTML = `<span>${hit}</span>
						<span class="search-span">
						${(kommunenavn) ? kommunenavn : kommunenr}
						</span>
						<span class="search-span">Innbyggertall: ${kommuneinfo.people.getInhabitantsLastYearTotal()} (sist målte)</span>`;

		// Bruker Mousedown - event i stedenfor click, for å kunne skje FØR blur-eventet (i input)
		li.addEventListener("mousedown", (event) => {
			let clickedName;
			if (event.target.nodeName == "LI"){
				clickedName = event.target.firstChild.textContent;
			} else if (event.target.nodeName == "SPAN") {
				clickedName = event.target.parentElement.firstChild.textContent;
			}
			let inputElements = event.target.parentElement.parentElement.parentElement.querySelectorAll("input");
			let isSecondary = event.target.closest(".search-output-right");
			populateSearchField(clickedName, inputElements, isSecondary);
		});
		output.appendChild(li);
	});
}

function getCorrectOutput(id, elem) {
	let output;
	// Send in this.id som parameter!
	// Sjekk hvilken input som skrives inn i, for å bestemme hvor forslagene skal skrives ut:
	if (id === "input-sam2")
		output = elem.parentElement.querySelector(".search-output-right");
	else
		output = elem.parentElement.querySelector(".search-output");
	return output
}
