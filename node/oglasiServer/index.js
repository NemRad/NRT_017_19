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

app.get('/prikazi_oglase_po_kategoriji/:kategorija',(request, response)=>{
    response.send(oglasiServis.prikaziOglasePoKategoriji(request.params["kategorija"]));
});

app.get('/get_oglas/:id',(request, response)=>{
    response.send(oglasiServis.getOglas(request.params["id"]));
});

app.post('/dodaj_oglas',(request, response)=>{
    oglasiServis.dodajOglas(request.body);
    console.log(request.body)
    response.end("OK");
})
app.post('/promeni_oglas/',(request, response)=>{
    oglasiServis.promeniOglas(request.body);
    console.log("a")
    response.end("OK");
})

app.delete('/obrisi_oglas/:id',(request, response)=>{
    oglasiServis.obrisiOglas(request.params["id"]);
    response.end("OK");
});

app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});