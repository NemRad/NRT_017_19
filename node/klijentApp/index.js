const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogledZaNaziv("index"));
});

app.get("/prikazi_oglase",(req,res)=>{
    axios.get('http://localhost:3000/prikazi_oglase')
    .then(response => {
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <th scope="row">${element.id}</th>
            <td>${element.kategorija}</td>
            <td>${element.naziv}</td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/azuriranje/${element.id}">Azuriranje</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
        </tr>`;
        });
        res.send(procitajPogledZaNaziv("prikaz_oglasa").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
});
app.get("/detaljnije/:id",(req,res)=>{
    axios.get(`http://localhost:3000/get_oglas/${req.params["id"]}`)
    .then(response=>{
        let prikaz="";
            prikaz+=`<tr>
            <th scope="row">${response.data.id}</th>
            <td>${response.data.kategorija}</td>
            <td>${response.data.naziv}</td>
            <td>${response.data.datum}</td>
            <td>${response.data.cena}</td>
            <td>${response.data.tekst}</td>
            <td>${response.data.tagovi}</td>
            <td>${response.data.kontakt}</td>
            <td><a href="/azuriranje/${response.data.id}">Azuriranje</a></td>
            <td><a href="/obrisi/${response.data.id}">Obrisi</a></td>
        </tr>`;
        res.send(procitajPogledZaNaziv("prikaz_oglasa").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
});
app.get("/azuriranje/:id",(req,res)=>{
    axios.get(`http://localhost:3000/get_oglas/${req.params["id"]}`)
    .then(response=>{
        let prikaz="";
            prikaz+=`<input type="text" name="id" value="${response.data.id}" hidden>
            <label for="">Kategorija oglasa</label><input type="text"  class="form-control" name="kategorija" value="${response.data.kategorija}">
            <br>
            <label for="">Naslov oglasa</label><input type="text" class="form-control" name="naziv" value="${response.data.naziv}">
            <br>
            <label for="">Datum isteka</label><input type="date" class="form-control" name="datum" value="${response.data.datum}">
            <br>
            <label for="">Cena</label><input type="text" class="form-control" name="cena" value="${response.data.cena}">
            <br>
            <label for="">Tekst oglasa</label><input type="text" class="form-control" name="tekst" value="${response.data.tekst}">
            <br>
            <label for="">Tagovi (odvojiti sa ';')</label><input type="text" class="form-control" name="tagovi" value="${response.data.tagovi}">
            <br>
            <label for="">Kontakt</label><input type="email" class="form-control" name="mejl" value="${response.data.kontakt}">
        `;
        res.send(procitajPogledZaNaziv("azuriranje_oglasa").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
});
app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/obrisi_oglas/${req.params["id"]}`)
    res.redirect("/prikazi_oglase");
});
app.get("/dodaj_oglas",(req,res)=>{
    res.send(procitajPogledZaNaziv("dodavanje_oglasa"));
});
app.post("/snimi_oglas",(req,res)=>{
    axios.post("http://localhost:3000/dodaj_oglas",{
        kategorija:req.body.kategorija,
        naziv:req.body.naziv,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        tagovi:req.body.tagovi,
        kontakt:req.body.mejl
    })
    res.redirect("/prikazi_oglase");
});
app.post("/azuriraj_oglas",(req,res)=>{
    axios.post(`http://localhost:3000/promeni_oglas/`,{
        id:req.body.id,
        kategorija:req.body.kategorija,
        naziv:req.body.naziv,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        tagovi:req.body.tagovi,
        kontakt:req.body.mejl
    })
    res.redirect("/prikazi_oglase");
});
app.post("/filtriraj_oglase_po_kategoriji",(req,res)=>{
    console.log(req.body.kategorija)
    axios.get(`http://localhost:3000/prikazi_oglase_po_kategoriji/${req.body.kategorija}`)
    .then(response=>{
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <th scope="row">${element.id}</th
            <td>${element.kategorija}</td>
            <td>${element.naziv}</td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
        </tr>`;
        });
        
        res.send(procitajPogledZaNaziv("prikaz_oglasa").replace("#{data}",prikaz));
    })
});
app.listen(port,()=>{console.log(`klijent na portu ${port}`)});