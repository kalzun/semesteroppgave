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

function outputNotFound(){
    console.log("En kommune er undefined.");
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

