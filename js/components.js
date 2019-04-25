// event detaljer 
//tabell(this.target, "Detaljer", inputvalue)

// Tabell
function tabell(div, category, kommunenr, flerekommuner){
	switch (category){
		case "Detaljer":
			detaljer();
			break;
		case "Sammenligning":
			sammenligning();
			break;
	}

	function detaljer(){
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune = singleton.getInfo(kommunenr);

		const sisteBefolkning = kommune.people.getInhabitantsLastYearTotal();

		//console.log("Siste bef: " + sisteBefolkning);
		//const sisteSysselsatte = kommune.people.get 

	}

	function sammenligning(){
		// Allekommuner.people.getEducation(kommunenr)
	}

	function constructOutput(){
	//	div.addChild()
	}
	
}