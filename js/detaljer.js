function constructDetaljer() {
    const alleKommuner = l.getAlleKommuner();

    for (let kommune in alleKommuner) {
        console.log(kommune.navn)
    }
}
