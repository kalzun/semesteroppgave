function constructDetaljer() {
    const alleKommuner = l.getAlleKommuner();

    for (let index in alleKommuner) {
        console.log(alleKommuner[index].navn)
    }
}
