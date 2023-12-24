const express = require('express');
const router = express.Router();
const www = require("../bin/www");

router.post('/', async function(req, res) {
    const db = www.getDb();
    const { login } = req.body;
    const galeras = await new Promise((resolve, reject) => {
        db.all('select * from galera where login_dono = ?', [login], (err, rows) => {
            resolve(rows);
        })
    })
    res.send(galeras);
});

module.exports = router;