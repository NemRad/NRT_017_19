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
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.naziv}</td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
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
            <td>${response.data.id}</td>
            <td>${response.data.kategorija}</td>
            <td>${response.data.naziv}</td>
            <td>${response.data.datum}</td>
            <td>${response.data.cena}</td>
            <td>${response.data.tekst}</td>
            <td>${response.data.tagovi}</td>
            <td>${response.data.kontakt}</td>
            <td><a href="/obrisi/${response.data.id}">Obrisi</a></td>
        </tr>`;
        res.send(procitajPogledZaNaziv("prikaz_oglasa").replace("#{data}",prikaz));
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
app.post("/filtriraj_oglase_po_kategoriji",(req,res)=>{
    console.log(req.body.kategorija)
    axios.get(`http://localhost:3000/prikazi_oglase_po_kategoriji/${req.body.kategorija}`)
    .then(response=>{
        let prikaz="";
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
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