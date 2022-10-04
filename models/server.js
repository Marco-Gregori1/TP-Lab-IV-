const express = require('express');
const cors = require('cors');
const router = require('../routes/entities');

class Server {
        
    constructor(){
        this.app = express();
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
        this.app.use('/',require('../routes/entities'))
        this.app.all('*', (req,res) => (
            res.status(400),
            res.send({ERROR : "Pagina no encontrada"})
        ))
        
    }
    
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
        
    }
}

module.exports = Server