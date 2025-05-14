import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a conexão com o banco de dados usando as variáveis de ambiente
const con = mysql.createConnection({
    db_host: process.env.DB_HOST,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_database: process.env.DB_DATABASE,
    db_port:process.env.DB_PORT,
    db_connection:process.env.DB_CONNECTION
});

con.connect(function(err){
    if(err){
        console.log("Erro de Conexão!!")
    } else {
        console.log("Conectado!")
    }
});


export default con;
