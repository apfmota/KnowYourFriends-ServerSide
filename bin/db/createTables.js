module.exports = {
    createTables: (db) => {
        db.run("create table if not exists user (login varchar(255) unique, senha varchar(255))", [], (err) => {
            if (err != null) {
                console.log(err);
            }
        });
        db.run("create table if not exists galera (id integer primary key autoincrement, nome varchar(255), login_dono varchar(255))", [], (err) => {
            if (err != null) {
                console.log(err);
            }
        });
        db.run("create table if not exists amigo (id integer primary key autoincrement, nome varchar(255), id_galera integer, posicao integer)", [], (err) => {
            if (err != null) {
                console.log(err);
            }
        });
    }
}