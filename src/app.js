const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');



class App {
    constructor() {
        this.serve = express();

        mongoose.connect('mongodb+srv://igorbatistalima1:projetofinal123@cluster0.j9tun0k.mongodb.net/?retryWrites=true&w=majority',{
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