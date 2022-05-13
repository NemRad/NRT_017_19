const fs = require('fs');
const PATH="oglasi.json";

let procitajOglaseIzFajla=()=>{
    let oglase=fs.readFileSync(PATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(oglase);
}

let snimiOglase=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data));
}

exports.prikaziOglase = () => {
    return procitajOglaseIzFajla();
}

exports.prikaziOglasePoKategoriji = (kategorija) =>{
    return this.prikaziOglase().filter(oglas=>oglas.kategorija==kategorija);
}

exports.getOglas = (id) => {
    return this.prikaziOglase().find(x => x.id == id);
}

exports.dodajOglas = (novOglas) => {
    let id=1;
    let oglasi=this.prikaziOglase();
    if(oglasi.length>0){
        id=oglasi[oglasi.length-1].id+1;
    }
    novOglas.id=id;
    oglasi.push(novOglas)
    console.log(novOglas)
    snimiOglase(oglasi);
}

exports.obrisiOglas = (id) => {
    snimiOglase(this.prikaziOglase().filter(x => x.id != id));
}

exports.promeniOglas = (noviPodaci) => {
    console.log("A")
    let oglasi = this.prikaziOglase();
    
    oglasi.forEach(oglas => {
        if(oglas.id==noviPodaci.id)
        {
            oglas.kategorija==noviPodaci.kategorija;
            oglas.naslov==noviPodaci.naslov;
            oglas.datum==noviPodaci.datum;
            oglas.cena==noviPodaci.cena;
            oglas.tekst==noviPodaci.tekst;
            oglas.tagovi==noviPodaci.tagovi;
            oglas.kontakt==noviPodaci.mejl;
        }
    });

    snimiOglase(oglasi);
}