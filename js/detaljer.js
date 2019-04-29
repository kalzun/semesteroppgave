function oversikt() {
    const alleKommuner = l.getAlleKommuner();

    console.log("Creating table...");
    let table = addChild(div, null, 'table');
    const tHead = addChild(table, null, 'tHead');
    const tBody = addChild(table, null, 'tbody');
    const headerRow = addChild(tHead, 'Kommunenavn', 'th');
    addChild(tHead, 'Kommunenummer', 'th');

    for (let index in alleKommuner) {
        const currentRow = addChild(tBody, alleKommuner[index].navn, 'tr');
        addChild(currentRow, alleKommuner[index].id, 'td');
    }
};
