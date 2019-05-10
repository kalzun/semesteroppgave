document.addEventListener("DOMContentLoaded", function(event){
	const tabs = Array.from(document.getElementById("tabs").children);
    const buttons = Array.from(document.getElementById("buttons").children);
    const searchButtons = document.querySelectorAll(".searchbutton");
    const eduNames = kommuneSingleton.getEduName();
	const infoBox = document.querySelector(".infobox");
	const eduCodeBox = addChild(infoBox, null, "div", "class", "eduCodeBox");

	// Eventlistener til alle menyknappene
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(){

            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove("active");
                buttons[i].classList.remove("active");
            }
            tabs[i].classList.add("active");
            buttons[i].classList.add("active");
        });
    }

    // Eventlistener til Søkeknappene
	for (let index = 0; index < 2; index++){
		searchButtons[index].addEventListener("click", search);
	}

	// Dersom vinduets størrelse endres til mindre enn 900px, konverteres utdanningsnavn til utdanningskoder, og dersom størrelsen endres til større enn eller lik 900px.
	window.addEventListener("resize", changeVisibleEducation);

	// Legger til informasjon i forklaringsfelt i detaljer- og sammenlignings-dane
	for (key in eduNames){
		addChild(eduCodeBox, `Utdanningskode: ${key} = ${eduNames[key]}`, "div", "class", "infobox-elements");
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
	displayLoadingMessage(document.querySelector(".oversikt"));
});


// Kjøres når brukeren trykker på en søkeknapp
function search(event, suggestion, inputElements, isSecondary){
	let kommunenr1,
		kommunenr2,
		alleInputs,
		domElem,
		aParent;

	const targetClass = (event) ? event.target.id : null;
	alleInputs = [];	
    
    if (suggestion){
    	alleInputs.push(suggestion);
    	domElem = (isSecondary) ? document.getElementsByClassName("sammenligning")[0] : document.getElementsByClassName("detaljer")[0];
    }
    else {
    	aParent = event.target.parentElement.parentElement;
    	searchInputs = aParent.querySelectorAll("div .search");
    	for (inp in searchInputs) alleInputs.push(searchInputs[inp].value);
    	domElem = document.getElementsByClassName(targetClass)[0];
    }

    fullstendigDataSet.onload = function(){
    	// Hvis bruker skriver inn kommunenavn:
		// Convert name to id
    	(isNameInDataset(alleInputs[0])) ? kommunenr1 = kommuneSingleton.getID(alleInputs[0]) : kommunenr1 = alleInputs[0];
    	if (targetClass == "sammenligning")
        	(isNameInDataset(alleInputs[1])) ? kommunenr2 = kommuneSingleton.getID(alleInputs[1]) : kommunenr2 = alleInputs[1];
        
		removeLoadingMessage();
		if (suggestion && !isSecondary)
        	constructTable(domElem, "detaljer", kommunenr1, kommunenr2);
        else
        	constructTable(domElem, targetClass, kommunenr1, kommunenr2);

        changeVisibleEducation();

        // VIS informasjonsboks på bunnen av siden
        const infobox = document.querySelectorAll(".infobox");
        (kommunenr2) ? infobox[1].style.display = "flex" : infobox[0].style.display = "flex";
    }

    if (kommuneSingleton.isLoaded() == true) {
        fullstendigDataSet.onload();
    }else{
        displayLoadingMessage(domElem);
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
	let output, regexp;
	const names = kommuneSingleton.getAllNames();
	const IDs = kommuneSingleton.getAllIDs();
	let userInput = event.target.value;
	try {
		regexp = new RegExp(`^${userInput}`, 'gi');
	} catch(e) {
		//console.log(e)
		// Catcher parenteser og andre feil i inntastingen, men gjør ikke noe med dem. Unngår feilmelding i konsoll.
	}


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
	const maxHitsShown = 5; // Hvor mange forslag vil vi vise - maximum.
	
	// Start: Få output til å være like bred som inputen du skriver inn i:
	const inputElement = output.parentNode.querySelector("input");
	const inputWidth = inputElement.getBoundingClientRect().width;
	const inputBottom = inputElement.getBoundingClientRect().bottom;
	const contentElem = output.closest(".content");
	const computedStyles = window.getComputedStyle(contentElem);
	const offsetTopContent = inputBottom - (parseFloat(computedStyles.getPropertyValue("padding-top"))) - contentElem.getBoundingClientRect().top;

	if (output.classList.contains("search-output-right")) {
		const inputElement = output.parentNode.querySelectorAll("input")[1];
		const offsetRightContent =  inputElement.getBoundingClientRect().left - contentElem.getBoundingClientRect().left - parseFloat(computedStyles.getPropertyValue("padding-left"));
		output.style.marginLeft = offsetRightContent + "px";
	} else {
		const offsetLeftContent = inputElement.getBoundingClientRect().left - contentElem.getBoundingClientRect().left - parseFloat(computedStyles.getPropertyValue("padding-left"));
		output.style.marginLeft = offsetLeftContent + "px";
	}

	output.style.minWidth = inputWidth + "px";
	output.style.marginTop = offsetTopContent + "px";
	// End
	
	// Gå gjennom hver treff
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

						${kommuneinfo.people.getInhabitantsLastYearTotal() ?
						`<span class="search-span">Innbyggere: ${kommuneinfo.people.getInhabitantsLastYearTotal()} (sist målte)</span>` :
						 ""
						}`;

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
			
			search(null, clickedName, inputElements, isSecondary);
			//search(clickedName);
		});
		output.appendChild(li);
	});
}

function changeVisibleEducation() {
	const limit = 900;
	const tableElems = document.querySelectorAll(".detaljer .eduCat");
	const eduCodes = kommuneSingleton.getEduCodes();
	if (window.innerWidth < limit) {
		for (let i = 2; i < tableElems.length; i++) {
			const val = tableElems[i].innerText;
			if (!eduCodes.includes(val)) {
				const newVal = kommuneSingleton.getEduCodes(val);
				tableElems[i].innerHTML = newVal;
					const tooltip = document.createElement("span");
					if (tableElems[i].contains(tooltip))
						return;
					tooltip.setAttribute("class", "edu-tooltip");
					tooltip.innerHTML = val;
					tableElems[i].appendChild(tooltip);
			}
		}
	}else{
		for (let i = 2; i < tableElems.length; i++) {
			const val = tableElems[i].innerText;
			if (eduCodes.includes(val)) {
				const newVal = kommuneSingleton.getEduName(val);
				tableElems[i].innerHTML = newVal;
			}
		}
	}
}
