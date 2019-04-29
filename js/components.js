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

		//Presentasjon
		// Konstruerer tabellen
		console.log("Creating table...")
		let table = addChild(div, null, 'table')
		const tHead = addChild(table, null, 'tHead');
		const tBody = addChild(table, null, 'tbody');
		const headerRow = addChild(tHead, null, 'tr');
		const kommune1MennRow = addChild(tBody, null, 'tr');
		const kommune2MennRow = addChild(tBody, null, 'tr');
		const kommune1KvinnerRow = addChild(tBody, null, 'tr');
		const kommune2KvinnerRow = addChild(tBody, null, 'tr');

		//Years-objektet henter årstall fra det lengste av menn(1/2)/kvinner(1/2) objektene.
		let years = Object.keys(kommune1Menn);
		if (Object.keys(kommune1Kvinner).length > years.length) {
			years = Object.keys(kommune1Kvinner)
		}
		if (Object.keys(kommune2Menn).length > years.length) {
			years = Object.keys(kommune2Menn)
		}
		if (Object.keys(kommune2Kvinner).length > years.length) {
			years = Object.keys(kommune2Kvinner)
		}

		for (let i = 0; i < years.length + 1; i++) {
			if (i == 0) {
				console.log('Adding data to table...');
				addChild(headerRow, 'Kommune (Kjønn)/År', 'th');
				addChild(kommune1MennRow, `${kommune1['navn']} (Menn)`, 'td');
				addChild(kommune1KvinnerRow, `${kommune1['navn']} (Kvinner)`, 'td');
				addChild(kommune2MennRow, `${kommune2['navn']} (Menn)`, 'td');
				addChild(kommune2KvinnerRow, `${kommune2['navn']} (Kvinner)`, 'td');
			} else {
				addChild(headerRow, years[i-1], 'td');
				addChild(kommune1MennRow, kommune1Menn[years[i-1]], 'td');
				addChild(kommune1KvinnerRow, kommune1Kvinner[years[i-1]], 'td');
				addChild(kommune2MennRow, kommune2Menn[years[i-1]], 'td');
				addChild(kommune2KvinnerRow, kommune2Kvinner[years[i-1]], 'td');
			};
		}

		//Itererer gjennom hvert år i tabellen og sammenligner dataene i hver rad med dataene fra forrige år, markerer cellene (menn og kvinner) med høyest økning.
		//Ikke interresert i første år, da vi ikke har noen tidligere år å regne vekst ut i fra.

		const tableData = tBody.childNodes;
		// Itererer gjennom hvert år (kolonne) i tabellen
		for (let colIndex = 2; colIndex < tableData[0].childElementCount; colIndex++) {
			let largestDiff = {
				"menn": [undefined, null],
				"kvinner": [undefined, null]
			};
			//Itererer gjennom hver rad for hvert år
			for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
				const currentYear = {
					"menn": tableData[rowIndex].childNodes[colIndex].innerHTML,
					"kvinner": tableData[rowIndex + 2].childNodes[colIndex].innerHTML
				};
				const lastYear = {
					"menn": tableData[rowIndex].childNodes[colIndex - 1].innerHTML,
					"kvinner": tableData[rowIndex + 2].childNodes[colIndex - 1].innerHTML
				};
				let diff = {
					"menn": currentYear["menn"] - lastYear["menn"],
					"kvinner": currentYear["kvinner"] - lastYear["kvinner"]
				};
				if (diff["menn"] > largestDiff["menn"][1]) {
					largestDiff["menn"][1] = diff["menn"];
					largestDiff["menn"][0] = tableData[rowIndex].childNodes[colIndex];
				}
				if (diff["kvinner"] > largestDiff["kvinner"][1]) {
					largestDiff["kvinner"][1] = diff["kvinner"];
					largestDiff["kvinner"][0] = tableData[rowIndex + 2].childNodes[colIndex];
				}
			}
			if (largestDiff["menn"][0] != undefined) {
				largestDiff["menn"][0].setAttribute("style", "background-color: green")
			}
			if (largestDiff["kvinner"][0] != undefined) {
				largestDiff["kvinner"][0].setAttribute("style", "background-color: green")
			}
		}
	}
};

function addChild(parent, input, type, attr){
	const node = document.createElement(type);
	node.innerHTML = input;
	parent.appendChild(node);
	return node;
}
