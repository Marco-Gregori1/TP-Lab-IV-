const express = require('express');
const cors = require('cors');

class Server {
        
    constructor(){
        this.app = express();
        this.middleware();
        this.router();
        this.port = process.env.PORT;
        
    }
    middleware(){
        // Cors
        this.app.use(cors());
        // Public
        this.app.use(express.static('public'))
    }
    router(){
        //utilizar una ruta (/v1/entities) para dejar abierto a futuros agregados de multipes rutas
        this.app.use('/v1/entities',require('../routes/entities'))
        this.app.all('*', (req,res) => (
           res.status(400).json({ERROR : "Pagina no encontrada"})
        ))
        
    }
    
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server