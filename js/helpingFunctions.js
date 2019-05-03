/* Hjelpefunksjoner */

function addChild(parent, input, type, attrType, attrVal){
    const node = document.createElement(type);
    if (input == "undefined" || input === undefined){
        node.innerHTML = "-";
        node.classList += "no-data";
    }
    else
        node.innerHTML = input;

    if (attrType != undefined) {
        node.setAttribute(attrType, attrVal);
    }
    parent.appendChild(node);
    return node;
}

// Legger til data i hver celle i en rad.

function addData(kommune, parent, headerYears, category) {
    let data
    switch (category) {
        case "befolkning":
            data = kommune.people.getInhabitants();
            addCells(category);
            break;
        case "sysselsetting":
            data = kommune.people.getEmploymentRates();
            addCells(category);
            break;
        case "utdanning":
            data = kommune.people.getAllEducationRates();
            const eduCodes = kommune.people.getEduCodes();
            for (i in eduCodes) {
                const eduCode = eduCodes[i];
                addCells(category, eduCode);
            }
            console.log(data)
            break;
        default:
            return;
    }

    function addCells(category, subCategory) {
        const row = addChild(parent, null, "tr");
        let cellName
        (kommune.people.getEduName(subCategory) != undefined) ? cellName =kommune.people.getEduName(subCategory) : cellName = category;
        addChild(row, cellName, "td");

        for (j in headerYears) {
            const currentYear = headerYears[j];
            let cellData
            if (category != "utdanning"){
                cellData = data[currentYear];
            }else{
                cellData = ((data[subCategory][MENN][currentYear] + data[subCategory][KVINNER][currentYear]) / 2).toFixed(2);
            }
            addChild(row, cellData, "td", "class", "data-cell");
        }
    }
}


// Itererer gjennom gitt array med datasett, og returnerer årene fra disse i et array med alle årstall (uten duplikater).
// Tar høyde for at elementene i arrayet har årstall på nivå to eller tre i objektet. Eks. på nivåer: dataSets = [currentDS[menn][årstall], currentDS[kategori][menn][årstall]]

/*function getYears(dataSets){
    let allYears = [];
    let gatherYears = function(obj){

    };
    for (i in dataSets) {
        let currentDS = dataSets[i];
        for (j in Object.keys(currentDS)){
            if (currentDS[j] == "menn" || currentDS == "kvinner") {
                for (gender in Object.keys(currentDS[j])) {
                    let currentYears = gatherYears(currentDS[j][gender]);
                    allYears.push.apply(allYears, currentYears);
                }
            }

        }
    }

        for (gender in Object.keys(obj)) {
            let currentYears = Object.keys(dataSets[i][gender]);
            for (j in currentYears) {
                if (allYears.includes(currentYears[j]) != true) {
                    allYears.push.apply(allYears, currentYears);
                }
            }
        }
    console.log(allYears)
}*/

// Legger til tekst som forteller brukeren at en eller begge kommunenr han søkte på ikke finnes, samt hvilke(t)
function outputNotFound(div, kommune1, kommune2, kommunenr1, kommunenr2){
    const target = div.querySelector(`.content`)
    if ([kommune1, kommune2].every((kom) => kom === "None found")){
        let message = `Ingen treff på kommunenr ${kommunenr1} eller ${kommunenr2}`;
        addChild(target, message, "p", "class", "error-message");
        console.log("En kommune er undefined.");
    }else if(kommune2 === "None found") {
        let message = `Ingen treff på kommunenr ${kommunenr2}`;
        addChild(target, message, "p", "class", "error-message");
    }else if(kommune1 === "None found") {
        let message = `Ingen treff på kommunenr ${kommunenr1}`;
        addChild(target, message, "p", "class", "error-message");
    };
}

function removeErrorMessages(div) {
    errorMessages = div.querySelectorAll(".content .error-message");
    for (let i = 0; i < errorMessages.length; i++) {
        let elem = errorMessages[i]
        console.log(1, i)
        console.log(elem)
        if (elem != undefined) elem.parentNode.removeChild(elem)
    }
}

function isContentInCategory(cat) {
    return cat == "Ingen tilgjengelige data.";
}

function displayLoadingMessage(domElem) {
    const message = "Laster data..."
    addChild(domElem, message, "p", "class", "loading-message")
}

function removeLoadingMessage() {
    const elem = document.querySelector(".loading-message");
    if (elem != undefined) elem.parentNode.removeChild(elem);
}

function removeTable(div, numberOfTables){
    for (let i = 0; i < numberOfTables; i++) {
        const table = div.querySelector("table");
        if (table != undefined) {
            console.log("Removing old table...")
            table.parentNode.removeChild(table);
        }
    }
}

