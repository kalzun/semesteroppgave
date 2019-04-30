// event detaljer
//tabell(this.target, "Detaljer", inputvalue)

// Tabell
function tabell(div, category, kommunenr1, kommunenr2){
	console.log("Tabell: " ,div, category);
	switch (category){
		case "oversikt":
			oversikt();
			break;
		case "detaljer":
			detaljer();
			break;
		case "sammenligning":
			sammenligning();
			break;
	}

	function oversikt() {
	    const alleKommuner = l.getAlleKommuner();

	    console.log("Creating table...");
	    let table = addChild(div, null, 'table');
	    const tHead = addChild(table, null, 'tHead');
	    const tBody = addChild(table, null, 'tbody');
	    const headerRow = addChild(tHead, 'Kommunenummer', 'th');
	    addChild(tHead, 'Kommunenavn', 'th');
	    addChild(tHead, 'Siste målte befolkningsantall', 'th');

	    for (let index in alleKommuner) {
	        const currentRow = addChild(tBody, alleKommuner[index].id, 'tr');
	        addChild(currentRow, alleKommuner[index].navn, 'td');
	        addChild(currentRow, alleKommuner[index].people.getInhabitantsLastYearTotal(), 'td');
	    }
	}


	function detaljer(){
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune = singleton.getInfo(kommunenr1);

		if (kommune === "None found"){
			outputNotFound();
			return;
		}

		const sisteBefolkning = kommune.people.getInhabitantsLastYearTotal();
		const sisteSysselsatteProsent = kommune.people.getEmploymentRatesLastYear();
		const sisteSysselsatteAntall = Math.floor(sisteBefolkning * sisteSysselsatteProsent / 100);

		// Høyere utdanningsprosent og antall:
		const sisteUtdanningProsentUniKort = kommune.people.getEducationRatesLastYearSpecified(UNIKORT);
		const sisteUtdanningAntallUniKort = Math.floor((sisteUtdanningProsentUniKort * sisteBefolkning) / 100);
		const sisteUtdanningProsentUniLang = kommune.people.getEducationRatesLastYearSpecified(UNILANG);
		const sisteUtdanningAntallUniLang = Math.floor((sisteUtdanningProsentUniLang * sisteBefolkning) / 100);
		const sisteUtdProsentGjennomsnitt = (sisteUtdanningProsentUniKort + sisteUtdanningProsentUniLang) / 2;
		const sisteUtdAntall = Math.floor(sisteBefolkning * sisteUtdProsentGjennomsnitt / 100);



		/*
		Vise tabell med
		kommunens navn,
		kommunenummer,
		siste målte befolkning
		siste målte statistikk for sysselsetting (antall og prosent)
		siste målte statistikk for høyere utdanning (antall og prosent)
		*/

		//Presentasjon
		// Konstruerer tabellen
		console.log("Creating table...")
		let table = addChild(div, null, 'table')
		const tHead = addChild(table, null, 'tHead');
		const tBody = addChild(table, null, 'tbody');
		const headerRow = addChild(tHead, `${kommune['navn']}`, 'tr');
		//const infoRow = addChild(tBody, null, 'tr');

		console.log('Adding data to table...');
		const befRow = addChild(tBody, `Befolkning`, 'tr');
		const sysselRow = addChild(tBody, `Sysselsatte`, 'tr');
		const utdKortRow = addChild(tBody, `Utdanning (Universitets- og høgskolenivå kort)`, 'tr');
		const utdLangRow = addChild(tBody, `Utdanning (Universitets- og høgskolenivå lang)`, 'tr');

		addChild(headerRow, 'Antall', 'th');
		addChild(headerRow, 'Prosent', 'th');

		addChild(befRow, sisteBefolkning, 'td');
		addChild(sysselRow, sisteSysselsatteAntall, 'td');
		addChild(sysselRow, sisteSysselsatteProsent, 'td');
		addChild(utdKortRow, sisteUtdanningAntallUniKort, 'td');
		addChild(utdKortRow, sisteUtdanningProsentUniKort, 'td');
		addChild(utdLangRow, sisteUtdanningAntallUniLang, 'td');
		addChild(utdLangRow, sisteUtdanningProsentUniLang, 'td');


/*
		Vise historisk utvikling
		Befolkning (ANTALL)
		sysselsetting (PROSENT)
		utdanning (ALLE UTDANNINGER I PROSENT)
*/

		// Historisk utvikling

		(function historisk() {
			const befolkningHistorisk = kommune.people.getInhabitants();
			const sysselsatteHistorisk = kommune.people.getEmploymentRates();
			const utdanningHistorisk = kommune.people.getAllEducationRates();

			//Presentasjon
			let table = addChild(div, null, 'table')
			const tHead = addChild(table, null, 'tHead');
			const tBody = addChild(table, null, 'tbody');
			const headerRow = addChild(tHead, ``, 'tr');

			const befRow = addChild(tBody, 'Befolkning', 'tr');
			const sysRow = addChild(tBody, 'Sysselsatte', 'tr');
			const eduCodes = kommune.people.getEduCodes();

			let eduRow = {};

			for (let i = 0, len = eduCodes.length; i < len; i++) {
				eduRow[i] = addChild(tBody, `${kommune.people.getEduName(eduCodes[i])}`, 'tr');
			}

			// Bruker education-datasett for å finne flest år.

			const eduYears = Object.keys(utdanningHistorisk[GRUNNSKOLE][MENN]);

			for (let i = 0, len = eduYears.length; i < len; i++) {
				addChild(headerRow, ``, 'th');
				addChild(headerRow, `${eduYears[i]}`, 'th');
				addChild(befRow, `${befolkningHistorisk[eduYears[i]]}`, 'td');
				addChild(sysRow, `${sysselsatteHistorisk[eduYears[i]]}`, 'td');

				for (let j = 0, eduLen = eduCodes.length; j < eduLen; j++){
					const avgEduPerc = ((utdanningHistorisk[eduCodes[j]][MENN][eduYears[i]] +
										utdanningHistorisk[eduCodes[j]][KVINNER][eduYears[i]]) / 2).toFixed(2);
					addChild(eduRow[j], `${avgEduPerc}`, 'td');
				}
			}
		})()

		// console.log("Siste bef: " + sisteBefolkning);
		// console.log("Siste Sysselsatte prosent: " + sisteSysselsatteProsent);
		// console.log("Siste Sysselsatte antall: " + sisteSysselsatteAntall);
		// console.log("Siste sisteUtdanningProsentUniKort " + sisteUtdanningProsentUniKort);
		// console.log("Siste sisteUtdanningProsentUniLang " + sisteUtdanningProsentUniLang);
		// console.log("Siste sisteUtdannings prosent gjennomsnitt: " + sisteUtdProsentGjennomsnitt);
		// console.log("Siste sisteUtdannings antall: " + sisteUtdAntall);
		// //const sisteSysselsatte = kommune.people.get



/*
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
*/
	}

	function sammenligning(){
		// Allekommuner.people.getEducation(kommunenr1)
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune1 = singleton.getInfo(kommunenr1);
		const kommune2 = singleton.getInfo(kommunenr2);

		// Sjekk om begge kommuner er definert.
		if([kommune1, kommune2].some((kom) => kom === "None found")){
			outputNotFound();
			return;
		}

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
		const headerRow = addChild(tHead, 'Kommune (Kjønn)/År', 'tr');
		const kommune1MennRow = addChild(tBody, `${kommune1['navn']} (Menn)`, 'tr');
		const kommune2MennRow = addChild(tBody, `${kommune2['navn']} (Menn)`, 'tr');
		const kommune1KvinnerRow = addChild(tBody, `${kommune1['navn']} (Kvinner)`, 'tr');
		const kommune2KvinnerRow = addChild(tBody, `${kommune2['navn']} (Kvinner)`, 'tr');

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

		console.log('Adding data to table...');
		for (let i = 0; i < years.length; i++) {
			addChild(headerRow, years[i], 'td');
			addChild(kommune1MennRow, kommune1Menn[years[i]], 'td');
			addChild(kommune1KvinnerRow, kommune1Kvinner[years[i]], 'td');
			addChild(kommune2MennRow, kommune2Menn[years[i]], 'td');
			addChild(kommune2KvinnerRow, kommune2Kvinner[years[i]], 'td');
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
				largestDiff["menn"][0].setAttribute("style", "green-highlight")
			}
			if (largestDiff["kvinner"][0] != undefined) {
				largestDiff["kvinner"][0].setAttribute("class", "green-highlight")
			}
		}
	}
};
