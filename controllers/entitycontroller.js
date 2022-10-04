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
    if (querysKeys.length != 0){
    querysKeys.forEach(element => { 
        if (!(element === "name" || element === "comics" || element === "series")){res.send({400 : "BAD request"}) /* res.status(500);*/ }
        else searchParams += (element +"="+querys[element] + "&")
    });
    }

    axios.get(`https://gateway.marvel.com:443/v1/public/characters?limit=50&${searchParams}ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`)
    .then(function (response) {
      res.status(200),
      res.send((response.data.data.results).map(function(obj){return [obj.name,obj.id]}))
    })
    .catch(function (error) {
        res.status(500), res.send({OOPS : "Algo salio mal"})
    })
    
}

const getHeroesById = (req = request ,res) => { 
    const id = req.params.id;
    axios.get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}`)
    .then(function (response) {
        res.status(200),res.send(response.data.data.results)
    })
    .catch(function (error) {
        error.code == 'ERR_BAD_REQUEST' ? res.status(400)
        : res.status(500)
        res.send(error)
    })
    
}

module.exports = {
    getHeroes,
    getTest,
    getHeroesById
}
