const express = require('express');
const router = express.Router();
const www = require("../bin/www");

router.post('/', async function(req, res) {
    const db = www.getDb();
    let amigos = await new Promise((resolve, reject) => {
        db.all("select * from amigo where id_galera = ?", [req.body.idGalera], (err, rows) => {
            resolve(rows);
        })
    })
    res.send(amigos);
});

module.exports = router;