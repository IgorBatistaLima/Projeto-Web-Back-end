const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();



class App {
    constructor() {
        this.serve = express();

        mongoose.connect(process.env.DATABASE_URL,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,

        }).then(() => {
            console.log('banco de dados conectado');
        }
        ).catch((err) => {
            console.log('erro ao conectar' + err);
        });
        


        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.serve.use(express.json());
    }

    routes() {
        this.serve.use(require('./routes'));
    }
}

module.exports = new App().serve;