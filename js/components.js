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

		const kommune1Menn = kommune1.people.getEmploymentRatesByGender(MENN);
		const kommune1Kvinner = kommune1.people.getEmploymentRatesByGender(KVINNER);
		const kommune2Menn = kommune2.people.getEmploymentRatesByGender(MENN);
		const kommune2Kvinner = kommune2.people.getEmploymentRatesByGender(KVINNER);


		//Tabell
		let table = document.createElement('TABLE');
		div.appendChild(table)
		//Years-objektet henter årstall fra det lengste av menn(1/2)/kvinner(1/2) objektene.
		let years = Object.keys(kommune1Menn);
		if (Object.keys(kommune1Kvinner).length > years.length) {
			years = Object.keys(kommune1Kvinner)
		} // må utviddes for kommune 2
		console.log(years)

		const thead = addChild(table, null, 'thead');
		const tBody = addChild(table, null, 'tbody');
		const headerRow = addChild(thead, null, 'tr');
		const kommune1MennRow = addChild(tBody, null, 'tr');
		const kommune1KvinnerRow = addChild(tBody, null, 'tr');
		const kommune2MennRow = addChild(tBody, null, 'tr');
		const kommune2KvinnerRow = addChild(tBody, null, 'tr');

		for (let i = 0; i < years.length; i++) {
			if (i == 0) {
				console.log('Adding data to table');
				addChild(headerRow, 'Sysselsetting (kjønn)/ År', 'th');
				addChild(kommune1MennRow, `${kommune1['navn']} (Menn)`, 'td');
				addChild(kommune1KvinnerRow, `${kommune1['navn']} (Kvinner)`, 'td');
				addChild(kommune2MennRow, `${kommune2['navn']} (Menn)`, 'td');
				addChild(kommune2KvinnerRow, `${kommune2['navn']} (Kvinner)`, 'td');
			} else {
				addChild(headerRow, years[i], 'td');
				addChild(kommune1MennRow, kommune1Menn[years[i]], 'td');
				addChild(kommune1KvinnerRow, kommune1Kvinner[years[i]], 'td');
				addChild(kommune2MennRow, kommune2Menn[years[i]], 'td');
				addChild(kommune2KvinnerRow, kommune2Kvinner[years[i]], 'td');
			};
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
