/* Hjelpefunksjoner */

function addChild(parent, input, type, attrType, attrVal){
    const node = document.createElement(type);
    if (input == 'undefined' || input === undefined){
        node.innerHTML = null;
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
            console.log('Removing old table...')
            table.parentNode.removeChild(table);
        }
    }
}

function isNameInDataset(name) {
    const names = l.getAllNames();
    console.log("In dataset : "+names.includes(name))
    return names.includes(name);
}

function convertToId(name) {
    const id = l.getID(name);
    console.log("Convert to id : "+l.getID(name))
    return id;
}

