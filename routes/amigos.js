const express = require('express');
const router = express.Router();
const multer = require('multer');
const www = require("../bin/www")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads/');
  },
  filename: async (req, file, cb) => {
    const db = www.getDb();
    let idGalera = file.originalname.split(".")[0];
    let extensao = file.originalname.split(".")[1];
    console.log(file.originalname);
    let posicao = await new Promise((resolve, reject) => {
      db.all("select * from amigo where id_galera = ?", [idGalera], (err, rows) => {
        resolve(rows.length);
      })
    })
    console.log(`${idGalera}_${posicao}.${extensao}`);
    cb(null, `${idGalera}_${posicao}.${extensao}`);
  }
})

const upload = multer( { storage })

/* GET users listing. */
router.post('/', upload.single('imgAmigo'), async function(req, res, next) {
  const db = www.getDb();
  let { idGalera } = req.body;
  let posicao = await new Promise((resolve, reject) => {
    db.all("select * from amigo where id_galera = ?", [idGalera], (err, rows) => {
      resolve(rows.length);
    })
  })
  await new Promise((resolve, reject) => {
    db.run(`insert into amigo (nome, id_galera, posicao) values (?, ?, ?)`, [req.body.nomeAmigo, idGalera, posicao], (err) => {
      if (err != null) {
        console.log(err);
      }
      resolve();
    })
  })
  res.send('respond with a resource');
});

module.exports = router;
