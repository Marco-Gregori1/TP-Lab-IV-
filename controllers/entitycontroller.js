const { request, response, query } = require("express");
require('dotenv').config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TS = 1;
const HASH = process.env.HASH;

const axios = require('axios');



const getTest = ( req,res) => {
    res.send("TEST!!")
};

const getHeroes = (req = request ,res) => {
    const querys = req.query
    const querysKeys = Object.keys(querys);
    let searchParams = "";
    let invalid = false;
    if (querysKeys.length != 0){
    
    // Intento de validacion de parametros sin usar express-validator,
    // ignora querys vacias


    // Nota: Para buscar por serie y comics en necesario tener la id del personaje

    querysKeys.forEach(element => { 
        if ((element === "name" || element === "comics" || element === "series")){(querys[element].trim().length === 0) ? invalid = true : searchParams += (element +"="+querys[element] + "&")}
        else { invalid = true }
    });
    }

    if (invalid){/*res.status(403),*/res.send({ERROR : 'Parametro vacio o invalido'})}

    axios.get(`https://gateway.marvel.com:443/v1/public/characters?limit=50&${searchParams}ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`)
    .then(function (response) {
      res.send((response.data.data.results).map(function(obj){
        return [
        obj.name,
        obj.id,
        (obj.comics.items).map(function(obj){return obj.name}),
        (obj.series.items).map(function(obj){return obj.name})
    
    ]}))
    })
    .catch(function (error) {
        if(error.code == 'ERR_BAD_REQUEST'){res.status(404),res.send({404 : "No se encontro"})}
        else{res.status(500),res.send({OOPS : "Algo salio mal"})}
    })
    
}

const getHeroesById = (req = request ,res) => { 
    const id = req.params.id;
    axios.get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`)
    .then(function (response) {
        res.status(200),res.send(response.data.data.results)
    })
    .catch(function (error) {
        if(error.code == 'ERR_BAD_REQUEST'){res.status(404),res.send({404 : "No se encontro"})}
        else{res.status(500),res.send({OOPS : "Algo salio mal"})}
    })
}

module.exports = {
    getHeroes,
    getTest,
    getHeroesById
}
