var express = require('express');
var oglasiServis=require('radSaOglasimaModul');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//console.log("Radi")

app.get('/',(request, response)=>{ 
    
    response.send("Server radi");
});

app.get('/prikazi_oglase',(request, response)=>{
    response.send(oglasiServis.prikaziOglase())
});

app.get('/prikazi_oglase_po_kategoriji',(request, response)=>{
    response.send(oglasiServis.prikaziOglasePoKategoriji(request.query["kategorija"]));
});

app.get('/get_oglas',(request, response)=>{
    response.send(oglasiServis.getOglas(request.query["id"]));
});

app.post('/dodaj_oglas',(request, response)=>{
    oglasiServis.dodajOglas(request.body);
    response.end("OK");
})
app.post('/promeni_oglas/:id',(request, response)=>{
    oglasiServis.promeniOglas(request.params["id"],request.body);
    response.end("OK");
})

app.delete('/obrisi_oglas/:id',(request, response)=>{
    oglasiServis.obrisiOglas(request.params["id"]);
    response.end("OK");
});

app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});