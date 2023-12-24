const express = require('express');
const router = express.Router();
const www = require("../bin/www");

router.post('/', async function(req, res) {
    const db = www.getDb();
    let logou = await new Promise((resolve, reject) => {
        db.all("select * from user where login = ? and senha = ?", [req.body.login, req.body.senha], (err, rows) => {
            console.log(rows);
            resolve(rows.length == 1);
        })
        // db.get("select * from user where login = ? and senha = ?)", [req.body.login, req.body.senha], (err, row) => {
        //     console.log(row);
        //     resolve(row != null);
        // })
    });
    res.send(JSON.stringify({ logou }));
});

module.exports = router;