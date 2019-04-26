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
		// Allekommuner.people.getEducation(kommunenr)
		const singleton = AlleKommunerSingleton.getInstance();
		const kommune = singleton.getInfo(kommunenr);

		const menn = kommune.people.getEmploymentRatesByGender(MENN);
		const kvinner = kommune.people.getEmploymentRatesByGender(KVINNER);

		console.log(menn)
		console.log(kvinner)
	}

	function constructOutput(data){
	//	div.appendChild()
	}

}
