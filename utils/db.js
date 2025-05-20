import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a conexão com o banco de dados usando as variáveis de ambiente
const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,        // ✅ CORRETO
    user: process.env.DATABASE_USER,        // ✅ CORRETO
    password: process.env.DATABASE_PASSWORD, // ✅ CORRETO
    database: process.env.DATABASE_NAME,    // ✅ CORRETO
    port: parseInt(process.env.DATABASE_PORT) // ✅ CORRETO (converte para número)
});

con.connect(function(err) {
    if (err) {
        console.log("Erro de Conexão!!", err);
    } else {
        console.log("Conectado!");
    }
});

export default con;
