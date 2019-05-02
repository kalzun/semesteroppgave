// event detaljer
//tabell(this.target, "Detaljer", inputvalue)

// Tabell
function tabell(div, category, kommunenr1, kommunenr2){
	removeErrorMessages(div)
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

	// Lager tabellen til oversikt-fanen
	function oversikt() {
	    const alleKommuner = l.getAlleKommuner();

	    console.log("Creating table...");
	    let table = addChild(div, null, "table");
	    const tHead = addChild(table, null, "tHead");
	    const tBody = addChild(table, null, "tbody");
	    const headerRow = addChild(tHead, "Kommunenummer", "th");
	    addChild(tHead, "Kommunenavn", "th");
	    addChild(tHead, "Siste målte befolkningsantall", "th");

	    for (let index in alleKommuner) {
	        const currentRow = addChild(tBody, null, "tr");
	        addChild(currentRow, alleKommuner[index].id, "td")
	        addChild(currentRow, alleKommuner[index].navn, "td");
	        addChild(currentRow, alleKommuner[index].people.getInhabitantsLastYearTotal(), "td");
	    }
	}

	// Lager tabellen til detaljer-fanen
	function detaljer(){
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune = singleton.getInfo(kommunenr1);

		if (kommune === "None found"){
			outputNotFound(div, kommune, null, kommunenr1, null);
			return;
		}

		removeTable(div, 2); // Fjerne tabell funnet som child av div, og fjern 2 tabeller

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
		let table = addChild(div, null, "table")
		const tHead = addChild(table, null, "tHead");
		const tBody = addChild(table, null, "tbody");
		const headerRow = addChild(tHead, `${kommune["navn"]}`, "tr");
		//const infoRow = addChild(tBody, null, "tr");

		console.log("Adding data to table...");
		const befRow = addChild(tBody, null, "tr");
		const sysRow = addChild(tBody, null, "tr");
		const utdKortRow = addChild(tBody, null, "tr");
		const utdLangRow = addChild(tBody, null, "tr");

		addChild(befRow, "Befolkning", "td");
		addChild(sysRow, "Sysselsatte", "td");
		addChild(utdKortRow, "Utdanning (Universitets- og høgskolenivå kort)", "td");
		addChild(utdLangRow, "Utdanning (Universitets- og høgskolenivå lang)", "td");

		addChild(headerRow, "Antall", "th", "class", "row-header");
		addChild(headerRow, "Prosent", "th", "class", "row-header");

		addChild(befRow, sisteBefolkning, "td", "class", "data-cell");
		addChild(sysRow, sisteSysselsatteAntall, "td", "class", "data-cell");
		addChild(sysRow, sisteSysselsatteProsent, "td", "class", "data-cell");
		addChild(utdKortRow, sisteUtdanningAntallUniKort, "td", "class", "data-cell");
		addChild(utdKortRow, sisteUtdanningProsentUniKort, "td", "class", "data-cell");
		addChild(utdLangRow, sisteUtdanningAntallUniLang, "td", "class", "data-cell");
		addChild(utdLangRow, sisteUtdanningProsentUniLang, "td", "class", "data-cell");


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
			let table = addChild(div, null, "table")
			const tHead = addChild(table, null, "tHead");
			const tBody = addChild(table, null, "tbody");
			const headerRow = addChild(tHead, null, "tr");
			addChild(headerRow, "kategori/år", "th");

			const befRow = addChild(tBody, null, "tr");
			const sysRow = addChild(tBody, null, "tr");

			addChild(befRow, "Befolkning", "td");
			addChild(sysRow, "Sysselsatte", "td")

			const eduCodes = kommune.people.getEduCodes();

			let eduRow = {};

			for (let i = 0, len = eduCodes.length; i < len; i++) {
				eduRow[i] = addChild(tBody, null, "tr");
				addChild(eduRow[i], `${kommune.people.getEduName(eduCodes[i])}`, "td")
			}

			// Bruker education-datasett for å finne flest år.
			// Sjekker kun antall år i grunnskole for menn og kvinner, da det er rimelig å anta at det er her det er kjørt flest målinger.
			/* Vurdere å gå over til metode hvor vi itererer gjennom alle utdanningskategorier og kjønn og samler alle år til et array */
			const eduYears = Object.keys(utdanningHistorisk[GRUNNSKOLE][MENN]);
			if (Object.keys(utdanningHistorisk[GRUNNSKOLE][KVINNER]).length > eduYears.length) eduYears = Object.keys(utdanningHistorisk[GRUNNSKOLE][KVINNER]).length;

			for (let i = 0, len = eduYears.length; i < len; i++) {
				addChild(headerRow, `${eduYears[i]}`, "th");
				addChild(befRow, `${befolkningHistorisk[eduYears[i]]}`, "td");
				addChild(sysRow, `${sysselsatteHistorisk[eduYears[i]]}`, "td");

				for (let j = 0, eduLen = eduCodes.length; j < eduLen; j++){
					const avgEduPerc = ((utdanningHistorisk[eduCodes[j]][MENN][eduYears[i]] +
										utdanningHistorisk[eduCodes[j]][KVINNER][eduYears[i]]) / 2).toFixed(2);
					const currentRow = addChild(eduRow[j], null, "td");
					addChild(currentRow, `${avgEduPerc}`, "td");
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

	// Lager tabellen til sammenligning-fanen
	function sammenligning(){
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune1 = singleton.getInfo(kommunenr1);
		const kommune2 = singleton.getInfo(kommunenr2);

		// Sjekk at begge kommuner er definert, hvis ikke output feilmelding om ingen treff på kommunenr.
		if([kommune1, kommune2].some((kom) => kom === "None found")){
			console.log("not found")
			outputNotFound(div, kommune1, kommune2, kommunenr1, kommunenr2);
			return;
		}

		removeTable(div, 1); // Parametere: parent-element og antall tabeller

		const kommune1Menn = kommune1.people.getEmploymentRatesByGender(MENN);
		const kommune1Kvinner = kommune1.people.getEmploymentRatesByGender(KVINNER);
		const kommune2Menn = kommune2.people.getEmploymentRatesByGender(MENN);
		const kommune2Kvinner = kommune2.people.getEmploymentRatesByGender(KVINNER);


		//Presentasjon
		// Konstruerer tabellen
		let table = addChild(div, null, "table");
		const tHead = addChild(table, null, "tHead");
		const tBody = addChild(table, null, "tbody");
		const headerRow = addChild(tHead, "Kommune (Kjønn)/År", "tr");
		// Eksempel input på addChild: Oslo kommune (0301) (Menn)
		const kommune1MennRow = addChild(tBody, null, "tr");
		const kommune2MennRow = addChild(tBody, null, "tr")
		const kommune1KvinnerRow = addChild(tBody, null, "tr");
		const kommune2KvinnerRow = addChild(tBody, null, "tr");

		addChild(kommune1MennRow, `${kommune1["navn"]} (${kommunenr1}) (Menn)`, "td");
		addChild(kommune2MennRow, `${kommune2["navn"]} (${kommunenr2}) (Menn)`, "td");
		addChild(kommune1KvinnerRow, `${kommune1["navn"]} (${kommunenr1}) (Kvinner)`, "td");
		addChild(kommune2KvinnerRow, `${kommune2["navn"]} (${kommunenr2}) (Kvinner)`, "td");

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

		console.log("Adding data to table...");
		for (let i = 0; i < years.length; i++) {
			addChild(headerRow, years[i], "th", "class", "");
			let x = addChild(kommune1MennRow, kommune1Menn[years[i]], "td", "class", "data-cell");
			console.log(x)
			addChild(kommune1KvinnerRow, kommune1Kvinner[years[i]], "td", "class", "data-cell");
			addChild(kommune2MennRow, kommune2Menn[years[i]], "td", "class", "data-cell");
			addChild(kommune2KvinnerRow, kommune2Kvinner[years[i]], "td", "class", "data-cell");
		}

		//Itererer gjennom hvert år i tabellen og sammenligner dataene i hver rad med dataene fra forrige år, markerer cellene (menn og kvinner) med høyest økning.
		//Ikke interresert i første år, da vi ikke har noen tidligere år å regne vekst ut i fra.

		const tableData = tBody.childNodes;
		// Itererer gjennom hvert år (kolonne) i tabellen
		for (let colIndex = 2; colIndex <= tableData[0].childElementCount; colIndex++) {
			let largestDiff = {
				//kjønn: [DOM-element, verdi]
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
				largestDiff["menn"][0].setAttribute("class", "green-highlight");
			}
			if (largestDiff["kvinner"][0] != undefined) {
				largestDiff["kvinner"][0].classList.add("green-highlight");
			}
		}
	}
};
