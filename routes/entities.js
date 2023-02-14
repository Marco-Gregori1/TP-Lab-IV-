
const { Router } = require("express");


const { getHeroes, getTest, getHeroesById, getComicsByHeroId } = require("../controllers/entitycontroller") 

const router = Router();

router.get('/test',getTest)

// Listado de registros en formato json que muestre 50 o más registros // Listo
// y
// Listado de registros en formato json que pueda filtrarse a través de query params. 
// name, comics, series
router.get('/',getTest);

router.get('/personajes',getHeroes);

// Visualización de un registro en particular ( id ) // Listo
router.get('/personajes/:id',getHeroesById);

router.get('/personajes/:id/comics',getComicsByHeroId);


// Aclaración: Devolver status code en cada request (200, 401, 404 ,etc.
module.exports = router;
