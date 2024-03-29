// Konstruerer tabell som barn av gitt dom-element (div) utifra kategori og kommunenr.
// Add child funksjon definert i helpingFunctoins.js
function constructTable(div, category, kommunenr1, kommunenr2){
	//Fjerner ev. feilmeldinger eller ventemeldinger dersom disse finnes
	removeErrorMessages(div);
	removeLoadingMessage();

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
		const singleton = AlleKommunerSingleton.getInstance();
	    const alleKommuner = singleton.getAlleKommuner();

	    let table = addChild(div, null, "table", "class", "oversikt");
	    const tHead = addChild(table, null, "tHead");
	    const tBody = addChild(table, null, "tbody");
	    const headerRow = addChild(tHead, "Kommunenummer", "th");
	    addChild(tHead, "Kommunenavn", "th");
	    addChild(tHead, "Siste målte befolkningsantall", "th");

	    // Lager en rad i tabbell definert over for hver kommune i alleKommuner.
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

		div.querySelector(".municipalityName").innerHTML = `Kommune: ${kommune.navn}`

		const sisteBefolkning = kommune.people.getInhabitantsLastYearTotal();
		const sisteSysselsatteProsent = kommune.people.getEmploymentRatesLastYear();
		const sisteSysselsatteAntall = Math.floor(sisteBefolkning * sisteSysselsatteProsent / 100);

		// Høyere utdanningsprosent og antall:
		const sisteUtdanningProsentUniKort = kommune.people.getEducationRatesLastYearSpecified(UNIKORT).toFixed(2);
		const sisteUtdanningAntallUniKort = Math.floor((sisteUtdanningProsentUniKort * sisteBefolkning) / 100);
		const sisteUtdanningProsentUniLang = kommune.people.getEducationRatesLastYearSpecified(UNILANG).toFixed(2);
		const sisteUtdanningAntallUniLang = Math.floor((sisteUtdanningProsentUniLang * sisteBefolkning) / 100);
		const sisteUtdProsentGjennomsnitt = (sisteUtdanningProsentUniKort + sisteUtdanningProsentUniLang) / 2;
		const sisteUtdAntall = Math.floor(sisteBefolkning * sisteUtdProsentGjennomsnitt / 100);

		/*
		Konstruere tabell med
		kommunens navn,
		kommunenummer,
		siste målte befolkning
		siste målte statistikk for sysselsetting (antall og prosent)
		siste målte statistikk for høyere utdanning (antall og prosent)
		*/

		const target = div.querySelector(".lastT");

		let table = addChild(target, null, "table")
		const tHead = addChild(table, null, "tHead");
		const tBody = addChild(table, null, "tbody");

		// Tabell-rader.
		const headerRow = addChild(tHead, null, "tr");
		const befRow = addChild(tBody, null, "tr");
		const sysRow = addChild(tBody, null, "tr");
		const utdKortRow = addChild(tBody, null, "tr");
		const utdLangRow = addChild(tBody, null, "tr");

		// Beskrivelse til hver rad
		addChild(headerRow, "Siste målte", "th");
		addChild(befRow, "Befolkning", "td");
		addChild(sysRow, "Sysselsatte", "td");
		addChild(utdKortRow, "Utdanning (Universitets- og høgskolenivå kort)", "td");
		addChild(utdLangRow, "Utdanning (Universitets- og høgskolenivå lang)", "td");

		addChild(headerRow, "Antall", "th", "class", "row-header");
		addChild(headerRow, "Prosent", "th", "class", "row-header");

		// Data til hver rad
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
		(function historisk() {
			div.querySelector("#historicTHeader").innerHTML = "Historisk utvikling"
			const befolkningHistorisk = kommune.people.getInhabitants();
			const sysselsatteHistorisk = kommune.people.getEmploymentRates();
			const utdanningHistorisk = kommune.people.getEducationRates();
			const dataSets = [befolkningHistorisk, sysselsatteHistorisk, utdanningHistorisk];



			// Konstruerer tabell
			let target = div.querySelector(".historicT");
			let table = addChild(target, null, "table", "class", "historic-table");
			const tHead = addChild(table, null, "tHead");
			const tBody = addChild(table, null, "tbody");
			const headerRow = addChild(tHead, null, "tr");
			addChild(headerRow, null, "th");

			// Konstruerer en liste med alle år fra dataSets, og legger disse årene til tabell-headeren
			const yearList = getYears(dataSets);
			if (yearList) {
				for (let i = 0, len = yearList.length; i < len; i++) {
					addChild(headerRow, `${yearList[i]}`, "th");
				};
			}

			// For hver kategori, befolkning, sysselsetting, data legger vi til datarader i tabell-bodyen
			["befolkning", "sysselsetting", "utdanning"].forEach(function(name){addData(kommune, tBody, yearList, name);
			});
		})()
	}

/*
	Viser historiske data
	Sammenligner 2 kommuner
	Markerer det kommunen for hvert kjønn som har høyest økning i prosentpoeng.
*/
	function sammenligning(){
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune1 = singleton.getInfo(kommunenr1);
		const kommune2 = singleton.getInfo(kommunenr2);
		const kommuner = [kommune1, kommune2];

		// Sjekk at begge kommuner er definert, hvis ikke output feilmelding om ingen treff på kommunenr.
		if ([kommune1, kommune2].some((kom) => kom === "None found")){
			console.log("not found")
			outputNotFound(div, kommune1, kommune2, kommunenr1, kommunenr2);
			return;
		}

		// Fjerner ev. eksisterende tabell
		removeTable(div, 1);

		div.querySelector(".municipalityName").innerHTML = `${kommune1.navn} sammenlignet med ${kommune2.navn}`

		// Konstruerer tabellen
		const target = div.querySelector(".compareT")
		let table = addChild(target, null, "table");
		const tHead = addChild(table, null, "tHead");
		const tBody = addChild(table, null, "tBody");
		const headerRow = addChild(tHead, null, "tr");
		addChild(headerRow, "Kommune (Kjønn)/År", "th")

		const dataSets = [
			kommune1.people.getEmploymentRates(),
			kommune2.people.getEmploymentRates()
		];

		// Konstruerer en liste med alle år fra dataSets, og legger disse årene til tabell-headeren
		const yearList = getYears(dataSets);
		for (let i = 0, len = yearList.length; i < len; i++) {
			addChild(headerRow, `${yearList[i]}`, "th");
		}

		//Legger til sysselsettingsdata for begge kommunene i tabellen
		for (i in kommuner) {
			addData(kommuner[i], tBody, yearList, "sysselsetting", "sammenligning")
		}

		//Itererer gjennom hvert år i tabellen og sammenligner dataene i hver rad med dataene fra forrige år, markerer den kommunen for hvert kjønn med høyest økning i prosentpoeng.
		//Ikke interresert i første år, da vi ikke har noen tidligere år å regne vekst ut i fra.

		const tableData = tBody.childNodes;

		// Itererer gjennom hvert år (kolonne) i tabellen
		for (let colIndex = 2; colIndex < tableData[0].childElementCount; colIndex++) {
			let largestDiff = {
				//kjønn: [DOM-element, verdi]
				"menn": [undefined, null],
				"kvinner": [undefined, null]
			};
			//Itererer gjennom hver rad for hvert år
			for (let rowIndex = 0; rowIndex <= 2; rowIndex += 2) {
				const currentYear = {
					"menn": tableData[rowIndex].childNodes[colIndex].innerHTML,
					"kvinner": tableData[rowIndex + 1].childNodes[colIndex].innerHTML
				};
				const lastYear = {
					"menn": tableData[rowIndex].childNodes[colIndex - 1].innerHTML,
					"kvinner": tableData[rowIndex + 1].childNodes[colIndex - 1].innerHTML
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
					largestDiff["kvinner"][0] = tableData[rowIndex + 1].childNodes[colIndex];
				}
			}
			if (largestDiff["menn"][0] != undefined) largestDiff["menn"][0].classList.add("green-highlight");
			if (largestDiff["kvinner"][0] != undefined) largestDiff["kvinner"][0].classList.add("green-highlight");
		}
	}
};
