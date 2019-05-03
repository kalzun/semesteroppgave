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
function search(){
	let kommunenr1,
		kommunenr2;
    const iD = event.target.id;
    const domElem = document.getElementsByClassName(iD)[0];
    const aParent = event.target.parentElement.parentElement;
    const alleInputs = aParent.querySelectorAll("div .search");

    switch (iD){
    	case "detaljer":
    		// Hvis bruker skriver inn kommunenavn:
			// Convert name to id
			(isNameInDataset(alleInputs[0].value)) ? kommunenr1 = convertToId(alleInputs[0].value) : kommunenr1 = alleInputs[0].value;
    		break;
    	case "sammenligning":
    		(isNameInDataset(alleInputs[0].value)) ? kommunenr1 = convertToId(alleInputs[0].value) : kommunenr1 = alleInputs[0].value;
    		(isNameInDataset(alleInputs[1].value)) ? kommunenr2 = convertToId(alleInputs[1].value) : kommunenr2 = alleInputs[1].value;
    		break;
    };

    ds.onload = function(){
    	clearOutput(); // Fjerne regex-forslag
		removeLoadingMessage()
        tabell(domElem, iD, kommunenr1, kommunenr2);
    }
    if (l.isLoaded() == true) {
        ds.onload();
    }else{
        displayLoadingMessage(domElem)
    }
}


function regexChecker(event){
	const names = l.getAllNames();
	const IDs = l.getAllIDs();
	let userInput = event.target.value;
	let regexp = new RegExp(`^${userInput}`, 'gi');
	let output;
	
	// Sjekk hvilken input som skrives inn i, for å bestemme hvor forslagene skal skrives ut:
	if (this.id === "input-sam2") 
		output = this.parentElement.querySelector(".search-output-right");
	else
		output = this.parentElement.querySelector(".search-output");

	clearOutput(output);
	if (userInput.length > 0){
		outputRegexHits(names.filter((name) => name.search(regexp) !== -1), output);
		outputRegexHits(IDs.filter((id) => id.search(regexp) !== -1), output);
		// for (i in names) {
		// 	if (names[i].search(regexp) !== -1){
		// 		console.log("Navn: " + names[i]);
		// 		//outputRegexHit(names[i], output);
		// 	}
		// }
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
	hits.forEach((hit) => {
		const li = document.createElement("li");
		let kommunenr, kommunenavn;
		(Number(hit)) ? kommunenavn = l.getName(hit): kommunenr = l.getID(hit);  
		li.className = "search-suggestion";

		li.innerHTML = `${hit} 
						<span class="search-span">
						${(kommunenavn) ? kommunenavn : kommunenr}
						</span>
						<span class="search-span">Innbyggertall: 32421</span>`;
		
		//li.addEventListener("click", (event) => )
		output.appendChild(li);
	});
}
