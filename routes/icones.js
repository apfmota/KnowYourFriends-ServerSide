const express = require('express');
const router = express.Router();
const fs = require('fs')

const formatos = ['jpeg', 'jpg', 'png']

const getExtensao = (filename) => {
    for (let formato of formatos) {
        console.log(__dirname + `/uploads/${filename}.${formato}`);
        if (fs.existsSync(__dirname + `/uploads/${filename}.${formato}`)) {
            return formato;
        }
    }
}

router.get('/', function(req, res) {
    let { filename } = req.query;
    let extensao = getExtensao(filename);
    console.log(`${__dirname}/uploads/${filename}.${extensao}`);
    res.sendFile(`${__dirname}/uploads/${filename}.${extensao}`);
})

module.exports = router;