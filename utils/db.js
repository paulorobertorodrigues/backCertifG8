import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const mysql = require('mysql2');

// Criar a conexão com o banco de dados usando as variáveis de ambiente
const con = mysql.createConnection({
    databasehost: process.env.DATABASE_HOST,
    databasename: process.env.DATABASE_NAME,
    databasepassword: process.env.DATABASE_PASSWORD,
    databaseport: process.env.DATABASE_PORT,
    databaseuser: process.env.DATABASE_USER,
    port:process.env.PORT
});

con.connect(function(err){
    if(err){
        console.log("Erro de Conexão!!")
    } else {
        console.log("Conectado!")
    }
});


export default con;
