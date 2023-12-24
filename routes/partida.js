const express = require('express');
const router = express.Router();
const www = require("../bin/www");
const crypto = require("crypto")

const P1 = "P1";
const P2 = "P2";

class Partida {
    constructor(idGalera, idP1, idRespostaP1) {
        this.idGalera = idGalera;
        this.idP1 = idP1;
        this.idRespostaP1 = idRespostaP1;
        this.vez = P1;
    }
    idGalera;
    idP1;
    idRespostaP1;
    idP2;
    idRespostaP2;
    vez;
    vitoria;
}

var partidas = new Map();

router.post('/nova', async function(req, res) {
    const db = www.getDb();
    const { idGaleraEscolhida, login } = req.body;
    console.log(req.body);
    let codigoPartida = crypto.randomBytes(3).toString('hex');
    while (partidas.has(codigoPartida)) {
        codigoPartida = crypto.randomBytes(3).toString('hex');
    }
    codigoPartida = codigoPartida.toUpperCase();
    let amigos = await new Promise((resolve, reject) => {
        db.all("select * from amigo where id_galera = ?", [idGaleraEscolhida], (err, rows) => {
            resolve(rows);
        })
    });
    const indexResposta = crypto.randomInt(amigos.length - 1);
    partidas.set(codigoPartida, new Partida(idGaleraEscolhida, login, amigos[indexResposta].id));
    res.send({ codigoPartida });
});

router.post('/entrar', async function(req, res) {
    const db = www.getDb();
    let { login, codigo } = req.body;
    codigo = codigo.toUpperCase();
    let partida = partidas.get(codigo);
    if (partida !== undefined) {
        let amigos = await new Promise((resolve, reject) => {
            db.all("select * from amigo where id_galera = ?", [partida.idGalera], (err, rows) => {
                resolve(rows);
            })
        });
        let indexRespostaP2;
        do {
            indexRespostaP2 = crypto.randomInt(amigos.length - 1);
        } while (amigos[indexRespostaP2].id === partida.idRespostaP1);
        partida.idP2 = login;
        partida.idRespostaP2 = amigos[indexRespostaP2].id;
    }
    res.send( { partida });
});

router.post('/espera', async (req, res) => {
    const { partida } = req.body;
    res.send({ partidaPronta: partidas.get(partida).idP2 != null});
})

router.post('/carregar', async function(req, res) {
    const db = www.getDb();
    const {login, idPartida} = req.body;
    const partida = partidas.get(idPartida.toUpperCase());
    let resposta;
    let oponente;
    let vez = login === partida.idP1;
    if (login === partida.idP1) {
        resposta = partida.idRespostaP1;
        oponente = partida.idP2;
    } else {
        resposta = partida.idRespostaP2;
        oponente = partida.idP1;
    }
    let amigos = await new Promise((resolve, reject) => {
        db.all("select * from amigo where id_galera = ? and id != ?", [partida.idGalera, resposta], (err, rows) => {
            resolve(rows);
        })
    });

    let amigoResposta = await new Promise((resolve, reject) => {
        db.all("select * from amigo where id = ?", [resposta], (err, rows) => {
            resolve(rows);
        })
    });
    res.send({ amigoResposta, amigos, oponente, vez });
});

router.post('/jogada', async function(req, res) {
    const db = www.getDb();
    const {login, idPartida} = req.body;
    const partida = partidas.get(idPartida.toUpperCase());
    if (partida.vez == 
    P1) {
        partida.vez = P2;
    } else {
        partida.vez = 
    P1;
    }
    res.send({ sucesso: true });
});

router.post('/espera-vez', async function(req, res) {
    const db = www.getDb();
    const {login, idPartida} = req.body;
    const partida = partidas.get(idPartida.toUpperCase());
    let vezMudou = false;
    if (partida.idP1 == login && partida.vez == P1) {
        vezMudou = true;
    } else if (partida.idP2 == login && partida.vez == P2) {
        vezMudou = true;
    }
    let vitoria = undefined;
    if (partida.vitoria != undefined) {
        if (login == partida.idP1) {
            vitoria = partida.vitoria == P1;
        } else {
            vitoria = partida.vitoria == P2;   
        }
    }
    res.send({ vezMudou, vitoria })
});

router.post('/palpite', async function(req, res) {
    const db = www.getDb();
    const {login, idPartida, amigoPalpite} = req.body;
    const partida = partidas.get(idPartida.toUpperCase());
    let ganhou;
    if (login == partida.idP1) {
        ganhou = amigoPalpite.id == partida.idRespostaP2;
        partida.vitoria = ganhou ? P1 : P2;
    } else {
        ganhou = amigoPalpite.id == partida.idRespostaP1;
        partida.vitoria = ganhou ? P2 : P1;    
    }
    res.send({ ganhou });
});

module.exports = router;