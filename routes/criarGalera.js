const express = require('express');
const router = express.Router();
const www = require("../bin/www");

router.post('/', async function(req, res) {
    const db = www.getDb();
    await new Promise((resolve, reject) => {
        db.run(`insert into galera (nome, login_dono) values (?, ?)`, [req.body.nome, req.body.login], (err) => {
            if (err != null) {
                console.log(err);
            }
            resolve();
        })
    })
    let id = await new Promise((resolve, reject) => {
        db.all("select * from galera order by id desc limit 1", (err, rows) => {
            console.log(rows);
            resolve(rows[0].id);
        })
    })
    console.log(id);
    res.send({ id });
});

module.exports = router;