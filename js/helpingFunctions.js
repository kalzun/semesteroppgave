/* Hjelpefunksjoner */

// Konstruerer et element, gir den innhold, type og ev. atributt iht. argumenter og legger elementet til parent.
function addChild(parent, input, type, attrType, attrVal){
    const node = document.createElement(type);
    if (input === "undefined" || input === undefined || input === "NaN" || input === NaN){
        node.innerHTML = "-";
        node.classList.add("no-data");
    } else if (attrVal == "data-cell" && (input === null || input.length <= 0)) {
        node.innerHTML = "-";
        node.classList.add("no-data");
    }
    else
        node.innerHTML = input;

    if (attrType == "class") {
        node.classList.add(attrVal);
    }
    parent.appendChild(node);
    return node;
}

// Itererer gjennom gitt array med datasett, og returnerer årene fra disse i et array med alle årstall (uten duplikater).
// Tar høyde for at elementene i arrayet har årstall på nivå to eller tre i objektet. Eks. på nivåer: dataSets = [currentDS[menn][årstall], currentDS[kategori][menn][årstall]]

function getYears(dataSets){
    let allYears = [];
    for (i in dataSets) {
        let currentDS = dataSets[i];
        if (currentDS != "Ingen tilgjengelige data."){
            const objKeys = Object.keys(currentDS);
            for (j in currentDS){
                let currentYears;
                if (kommuneSingleton.getEduCodes().some((code) => objKeys.includes(code)))    {
                    for (gender in currentDS[j]) {
                        currentYears = Object.keys(currentDS[j][gender]);
                        for (k in currentYears) {
                            if (allYears.includes(currentYears[k]) == false && currentYears[k].length === 4) allYears.push(currentYears[k])
                        }
                    }
                }else{
                    currentYears = Object.keys(currentDS);
                    for (i in currentYears) {
                        if (allYears.includes(currentYears[i]) == false && currentYears[i].length === 4) allYears.push(currentYears[i])
                    }
                }
            }
        }
    }
    allYears = allYears.sort();
    return allYears;
}

// Legger til data i hver celle i en rad.

function addData(kommune, parent, headerYears, category, tab) {
    let data
    switch (category) {
        case "befolkning":
            data = kommune.people.getInhabitants();
            addCells(category);
            break;
        case "sysselsetting":
            if (tab == "sammenligning") {
                const genders = [MENN, KVINNER];
                for (let i = 0; i < 2; i++) {
                    const gender = genders[i]
                    data = kommune.people.getEmploymentRatesByGender(gender);
                    addCells(category, undefined, tab, gender);
                }
            }else{
                data = kommune.people.getEmploymentRates();
                addCells(category);
            }
            break;
        case "utdanning":
            data = kommune.people.getEducationRates();
            const eduCodes = kommuneSingleton.getEduCodes();
            for (i in eduCodes) {
                const eduCode = eduCodes[i];
                addCells(category, eduCode);
            }
            break;
        default:
            return;
    }

    function addCells(category, subCategory, tab, gender) {
        const row = addChild(parent, null, "tr");
        let cellName;
        const currentCat = kommuneSingleton.getEduName(subCategory);
        if (typeof currentCat !== "object") {
            cellName = currentCat;
        }else if(tab == "sammenligning"){
            cellName = `${kommune.navn} ${gender}`;
        }else{
            cellName = capFirstLetter(category);
        }
        addChild(row, cellName, "td", "class", "eduCat");

        for (j in headerYears) {
            const currentYear = headerYears[j];
            let cellData
            if (category != "utdanning"){
                cellData = data[currentYear];
            }else{
                try {
                    cellData = ((data[subCategory][MENN][currentYear] + data[subCategory][KVINNER][currentYear]) / 2).toFixed(2);
                } catch(e) {
                    cellData = undefined;
                }

            }
            addChild(row, cellData, "td", "class", "data-cell");
        }
    }
}

// Legger til tekst som forteller brukeren at en eller begge kommunenr han søkte på ikke finnes, samt hvilke(t)
function outputNotFound(div, kommune1, kommune2, kommunenr1, kommunenr2){
    const target = div.querySelector(`.msg-box`)
    if ([kommune1, kommune2].every((kom) => kom === "None found")){
        let message = `Ingen treff på kommunenr ${kommunenr1} eller ${kommunenr2}`;
        addChild(target, message, "p", "class", "error-message");
    }else if(kommune2 === "None found") {
        let message = `Ingen treff på kommunenr ${kommunenr2}`;
        addChild(target, message, "p", "class", "error-message");
    }else if(kommune1 === "None found") {
        let message = `Ingen treff på kommunenr ${kommunenr1}`;
        addChild(target, message, "p", "class", "error-message");
    };
}

function removeErrorMessages(div) {
    let errorMessages = div.querySelectorAll(`.msg-box .error-message`);
    for (let i = 0; i < errorMessages.length; i++) {
        let elem = errorMessages[i]
        if (elem != undefined) elem.parentNode.removeChild(elem)
    }
}

function isContentInCategory(cat) {
    return cat == "Ingen tilgjengelige data.";
}

function displayTimeoutMessage() {
    const targets = document.querySelectorAll(".msg-box");

    const message = `Ingen data tilgjengelig,
                     vennligst <button id="reload-button" type="submit" onClick="reloadPage();"
                     ">last inn på nytt</button> eller prøv senere...`
    for (let i = 0; i < targets.length; i++) {
        addChild(targets[i], message, "p")
    }
}

function reloadPage(){
    window.location.reload();
}

function displayLoadingMessage(domElem) {
    const message = "Laster data...";
    const loadingDiv = document.createElement("div");
    loadingDiv.setAttribute("class", "loading-div");
    domElem.appendChild(loadingDiv);
    addChild(loadingDiv, null, "div", "class", "loader");
    addChild(loadingDiv, message, "p", "class", "loading-message");
}

function removeLoadingMessage() {
    elems = document.querySelectorAll(".loading-div");
    if (elems){
        for (i in elems){
            while (elems[i].firstChild){
                elems[i].removeChild(elems[i].firstChild);
            }
        }
    }
}


function removeTable(div, numberOfTables){
    for (let i = 0; i < numberOfTables; i++) {
        const table = div.querySelector("table");
        if (table != undefined) table.parentNode.removeChild(table);
    }
}

function isNameInDataset(name) {
    const names = kommuneSingleton.getAllNames();
    return names.includes(capFirstLetter(name));
}

function convertToId(name) {
    const id = kommuneSingleton.getID(name);
    return id;
}

function capFirstLetter(word) {
    // Gjør første bokstav i word Stor.
    if (word === undefined || word === "") return word;
    return word[0].toUpperCase() + word.slice(1);
}
