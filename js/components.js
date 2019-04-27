// event detaljer
//tabell(this.target, "Detaljer", inputvalue)

// Tabell
function tabell(div, category, kommunenr1, kommunenr2){
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
		const kommune = singleton.getInfo(kommunenr1);

		const sisteBefolkning = kommune.people.getInhabitantsLastYearTotal();

		const sisteSysselsatteProsent = kommune.people.getEmploymentRatesLastYear();
		const sisteSysselsatteAntall = sisteBefolkning * sisteSysselsatteProsent / 100;

		// Høyere utdanningsprosent og antall:
		const sisteUtdanningProsentUniKort = kommune.people.getEducationRatesLastYearSpecified(UNIKORT);
		const sisteUtdanningProsentUniLang = kommune.people.getEducationRatesLastYearSpecified(UNILANG);
		const sisteUtdProsentGjennomsnitt = (sisteUtdanningProsentUniKort + sisteUtdanningProsentUniLang) / 2;
		const sisteUtdAntall = sisteBefolkning * sisteUtdProsentGjennomsnitt / 100;

		//

		console.log("Siste bef: " + sisteBefolkning);
		console.log("Siste Sysselsatte prosent: " + sisteSysselsatteProsent);
		console.log("Siste Sysselsatte antall: " + sisteSysselsatteAntall);
		console.log("Siste sisteUtdanningProsentUniKort " + sisteUtdanningProsentUniKort);
		console.log("Siste sisteUtdanningProsentUniLang " + sisteUtdanningProsentUniLang);
		console.log("Siste sisteUtdannings prosent gjennomsnitt: " + sisteUtdProsentGjennomsnitt);
		console.log("Siste sisteUtdannings antall: " + sisteUtdAntall);
		//const sisteSysselsatte = kommune.people.get

		// Historisk utvikling
		const sysselsatteHistorisk = kommune.people.getEmploymentRates();
		const befolkningHistorisk = kommune.people.getInhabitants();
		const utdanningHistorisk = kommune.people.getAllEducationRates();

		for (let year in sysselsatteHistorisk)
			console.log(`Gjennomsnittelig sysselsettingsprosent ${year}: ${sysselsatteHistorisk[year]}`);
		for (let year in befolkningHistorisk)
			console.log(`Total befolkning ${year}: ${befolkningHistorisk[year]}`);
		for (let edu in utdanningHistorisk) {
			for (gender in utdanningHistorisk[edu]) {
				for (let year in utdanningHistorisk[edu][gender]) {
					console.log(`Prosentvis ${edu}-utdanning blandt ${gender} i ${year}: ${utdanningHistorisk[edu][gender][year]}`)
				}
			}
		}
	}

	function sammenligning(){
		// Allekommuner.people.getEducation(kommunenr1)

		const singleton = AlleKommunerSingleton.getInstance();
		const kommune1 = singleton.getInfo(kommunenr1);
		const kommune2 = singleton.getInfo(kommunenr2);

		const menn1 = kommune1.people.getEmploymentRatesByGender(MENN);
		const kvinner1 = kommune1.people.getEmploymentRatesByGender(KVINNER);
		const menn2 = kommune2.people.getEmploymentRatesByGender(MENN);
		const kvinner2 = kommune2.people.getEmploymentRatesByGender(KVINNER);

		console.log(menn1);
		console.log(kvinner1);

		//Tabell
		let table = document.createElement('TABLE');
		div.appendChild(table)
		let longest = menn1;
		if (Object.keys(kvinner1).length > Object.keys(menn1).length) {
			longest = kvinner1;
		};

		const thead = addChild(table, undefined, 'thead');
		const headerRow = addChild(thead, undefined, 'tr');
		addChild(headerRow, 'Sysselsetting', 'th');
		addChild(headerRow, 'Kjønn', 'th');

		for (year in longest) {
			addChild(headerRow, year, 'th');
		}
	}

	function constructOutput(data){
	//	div.appendChild()
	}

}
	function addChild(parent, input, type){
		const node = document.createElement(type);
		node.innerHTML = input;
		parent.appendChild(node);
		return node;
	}
