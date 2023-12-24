const express = require('express');
const router = express.Router();
const www = require("../bin/www");

router.post('/', async function(req, res) {
    const db = www.getDb();
    let resultado = "Sucesso";
    await new Promise((resolve, reject) => {
        db.run("insert into user (login, senha) values (?, ?)", [req.body.login, req.body.senha], (err) => {
            if (err != null) {
                resultado = "Login já utilizado";
            }
            resolve();
        })
    });
    res.send(JSON.stringify({ resultado }));
});

module.exports = router;