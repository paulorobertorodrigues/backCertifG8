import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a conexão com o banco de dados usando as variáveis de ambiente
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect(function(err){
    if(err){
        console.log("Erro de Conexão!!")
    } else {
        console.log("Conectado!")
    }
});


export default con;
