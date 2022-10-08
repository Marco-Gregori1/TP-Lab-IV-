const { request } = require("express");

//Alternativa getHash
const md5 = require('md5');

require('dotenv').config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TS = 1;
const HASH = process.env.HASH;

const axios = require('axios');

const getTest = ( req,res) => {
    res.send("TEST!!")
};

//Alternativa getHash
const getHash = () => {
    const ts = Date.now();
    return {
                ts,
                md5:md5(ts + PRIVATE_KEY + PUBLIC_KEY)
            }
};

const getHeroes = (req = request ,res) => {
    const querys = req.query
    const querysKeys = Object.keys(querys);
    let searchParams = "";
    let invalid = false;
    //Alternativa getHash
    const objHash = getHash();

     //identanción de llaves
    if (querysKeys.length != 0){
        
        // Intento de validacion de parametros sin usar express-validator,
        // ignora querys vacias


        // Nota: Para buscar por serie y comics en necesario tener la id del personaje

        querysKeys.forEach(element => { 
            if ((element === "name" || element === "comics" || element === "series" || element === "nameStartsWith")){
                (querys[element].trim().length === 0) ? invalid = true : searchParams += (element +"="+querys[element] + "&")
            }else { 
                //Ojo con este invalid que podría dar un falso positivo
                invalid = true 
            }
        });
    }

    //estandarizar formato de salida para los json
     //identanción de llaves y corchetes
    if (invalid){
        /*res.status(403),*/
        res.send({ERROR : 'Parametro vacio o invalido'})
    }    
    axios.get(`https://gateway.marvel.com:443/v1/public/characters?limit=50&${searchParams}ts=${objHash.ts}&apikey=${PUBLIC_KEY}&hash=${objHash.md5}`)
    .then(function (response) {
        //Utilizar la misma respuesta del endpoint de marvel y retornarla
        res.status(response.data.code).json(response.data);       
        //Se pierden las claves de los valores
        /* res.send((response.data.data.results).map(
            function(obj){
                return [
                obj.name,
                obj.id,
                (obj.comics.items).map(function(obj){return obj.name}),
                (obj.series.items).map(function(obj){return obj.name})    
                ]
            })
        ); */
    })
    .catch(function (error) {
        //estandarizar formato de salida para los json
        (error.code == 'ERR_BAD_REQUEST')
            ?res.status(404).json({msg : "Page not found"})
            :res.status(500).json({msg : "Error del servidor"})
        
    })
    
}

const getHeroesById = (req = request ,res) => { 
    const id = req.params.id;
    const objHash = getHash();

    axios.get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${objHash.ts}&apikey=${PUBLIC_KEY}&hash=${objHash.md5}`)
    .then(function (response) {
        //estandarizar formato de salida para los json
        res.status(200).json(response.data.data.results)
    })
    .catch(function (error) {
        //estandarizar formato de salida para los json
        if(error.code == 'ERR_BAD_REQUEST'){
            res.status(404).json({404 : "No se encontro"})}
        else{
            res.status(500).json({OOPS : "Algo salio mal"})
        }
    })
}

module.exports = {
    getHeroes,
    getTest,
    getHeroesById
}
