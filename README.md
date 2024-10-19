Pra Rodar o codido do Server - Abaixo

 npm start

Descrição Geral
Este código é uma parte de uma aplicação backend escrita em JavaScript utilizando o framework Express.js. Ele implementa uma rota de autenticação de administradores, que valida as credenciais fornecidas (email e senha) e gera um JSON Web Token (JWT) para sessões autenticadas. O token gerado é armazenado como um cookie no navegador do cliente.

Código Documentado
javascript
Copiar código
import express from 'express';  // Importa o framework Express.js para criação de servidores e manipulação de rotas.
import con from '../utils/db.js';  // Importa o módulo de conexão com o banco de dados MySQL.
import jwt from 'jsonwebtoken';  // Importa o módulo jsonwebtoken para geração de tokens JWT.

const router = express.Router();  // Cria um novo objeto de roteador do Express para definir rotas.


// Define uma rota POST para autenticação de administradores.
router.post('/adminlogin', (req, res) => {
    
    // SQL query para buscar um administrador no banco de dados usando o email e a senha fornecidos.
    const sql = "SELECT * from admin Where email = ? and password = ?";
    
    // Executa a consulta SQL com os parâmetros fornecidos na requisição.
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        
        // Verifica se ocorreu um erro na execução da consulta SQL.
        if (err) return res.json({ loginStatus: false, Error: "Query error" });

        // Verifica se o resultado da consulta retorna algum registro.
        if (result.length > 0) {
            // Se um registro for encontrado, obtém o email do administrador.
            const email = result[0].email;

            // Gera um token JWT com o email e a função do usuário, com uma chave secreta e uma expiração de 1 dia.
            const token = jwt.sign(
                { role: "admin", email: email },  // Payload do token que contém o email e a função do usuário.
                "jwt_secret_key",  // Chave secreta utilizada para assinar o token.
                { expiresIn: '1d' }  // Define o tempo de expiração do token para 1 dia.
            ); 

            // Armazena o token gerado como um cookie no cliente.
            res.cookie('token', token);

            // Retorna um objeto JSON indicando que o login foi bem-sucedido.
            return res.json({ loginStatus: true });
        } else {
            // Se nenhum registro for encontrado, retorna um erro indicando que o email ou senha estão incorretos.
            return res.json({ loginStatus: false, Error: "Senha ou email incorretos!" });
        }
    });
});

// Exporta o roteador como "adminRouter", permitindo que seja utilizado em outras partes da aplicação.
export { router as adminRouter };
Explicação Detalhada
Imports:

express: O framework utilizado para a construção do servidor e definição das rotas.
con: O módulo que fornece a conexão com o banco de dados MySQL, onde as credenciais dos administradores estão armazenadas.
jwt: A biblioteca para geração e verificação de JSON Web Tokens, que são usados para autenticação e controle de sessões.
Router:

O código cria uma instância do roteador Express para definir as rotas do servidor.
Rota de Login (/adminlogin):

Esta rota é acionada através de requisições do tipo POST.
A consulta SQL busca por um administrador que corresponda ao email e senha fornecidos no corpo da requisição.
Consulta SQL:

A consulta utiliza parâmetros para evitar SQL Injection, uma prática comum para proteger as consultas SQL.
Verificação de Resultados:

Se ocorrer um erro na consulta, a resposta JSON indica falha na consulta.
Se um administrador for encontrado, o código gera um token JWT que inclui o email e a função de "admin". O token tem uma validade de 1 dia.
Armazenamento do Token:

O token gerado é armazenado como um cookie no navegador do cliente, permitindo que ele seja enviado junto com requisições subsequentes.
Respostas:

Em caso de sucesso, a resposta JSON inclui { loginStatus: true }.
Em caso de falha (senha ou email incorretos), a resposta inclui uma mensagem de erro apropriada.
Considerações de Segurança
Senhas em Texto Plano: As senhas são verificadas em texto plano, o que não é recomendado. Em produção, as senhas devem ser armazenadas de forma segura (ex: usando bcrypt para hash).
Chave Secreta: A chave secreta usada para assinar o JWT deve ser mais complexa e armazenada em um local seguro, como variáveis de ambiente, em vez de estar hard-coded no código.
Essa estrutura de código fornece uma base funcional para autenticação de administradores em uma aplicação web, permitindo que o sistema identifique e controle o acesso dos usuários autenticados.

Descrição Geral
Este código é responsável por configurar e estabelecer uma conexão com um banco de dados MySQL. Ele utiliza o pacote mysql2 para a conexão com o banco e dotenv para carregar as variáveis de ambiente, que contêm as credenciais necessárias para acessar o banco de dados.

Código Documentado
javascript
Copiar código
import mysql from 'mysql2';  // Importa o módulo mysql2 para manipulação de conexões com bancos de dados MySQL.
import dotenv from 'dotenv';  // Importa o módulo dotenv para carregar variáveis de ambiente de um arquivo .env.

// Carrega as variáveis de ambiente do arquivo .env.
dotenv.config();

// Cria a conexão com o banco de dados usando as variáveis de ambiente.
const con = mysql.createConnection({
    host: process.env.HOST,        // O host do banco de dados, por exemplo, 'localhost' ou um endereço IP.
    user: process.env.USER,        // O nome de usuário para autenticação no banco de dados.
    password: process.env.PASSWORD, // A senha do usuário do banco de dados.
    database: process.env.DATABASE  // O nome do banco de dados ao qual se está tentando conectar.
});

// Tenta estabelecer a conexão com o banco de dados.
con.connect(function(err){
    if(err){
        // Se houver um erro na conexão, exibe uma mensagem de erro no console.
        console.log("connection error");
    } else {
        // Se a conexão for bem-sucedida, exibe uma mensagem de sucesso no console.
        console.log("Connected");
    }
});

// Exporta a conexão para que possa ser utilizada em outras partes da aplicação.
export default con;
Explicação Detalhada
Imports:

mysql2: Este módulo é uma biblioteca que fornece funcionalidades para se conectar e interagir com bancos de dados MySQL de forma mais eficiente e com suporte a Promises.
dotenv: Esta biblioteca carrega variáveis de ambiente de um arquivo .env, permitindo que credenciais e configurações sensíveis sejam mantidas fora do código-fonte.
Carregamento de Variáveis de Ambiente:

O método dotenv.config() lê o arquivo .env e armazena as variáveis de ambiente definidas nesse arquivo no objeto process.env. Isso permite acessar valores como host, usuário, senha e nome do banco de dados.
Criação da Conexão:

mysql.createConnection() é chamado com um objeto de configuração que inclui:
host: O endereço do servidor onde o banco de dados está hospedado.
user: O nome de usuário utilizado para se conectar ao banco de dados.
password: A senha correspondente ao usuário.
database: O nome do banco de dados com o qual se deseja trabalhar.
Estabelecimento da Conexão:

con.connect() é um método que tenta estabelecer uma conexão com o banco de dados. Ele aceita uma função de callback que verifica se houve um erro durante a conexão.
Se ocorrer um erro, uma mensagem "connection error" é exibida no console.
Se a conexão for bem-sucedida, a mensagem "Connected" é exibida, indicando que a aplicação agora pode interagir com o banco de dados.
Exportação da Conexão:

A conexão é exportada como padrão (export default con;), permitindo que outros módulos importem essa conexão e utilizem-na para realizar operações de banco de dados.
Considerações de Segurança
Senhas e Credenciais: As credenciais do banco de dados são carregadas a partir do arquivo .env, o que é uma boa prática de segurança. É importante garantir que o arquivo .env não seja exposto em sistemas de controle de versão (por exemplo, adicionando-o ao .gitignore).
Tratamento de Erros: O tratamento de erros aqui é básico. Para uma aplicação em produção, pode ser interessante implementar um sistema de logging mais robusto ou lançar exceções para que a aplicação possa lidar com falhas de forma mais controlada.
Esse código fornece uma configuração básica, mas eficaz, para conectar-se a um banco de dados MySQL, permitindo que outras partes da aplicação realizem operações de CRUD (Create, Read, Update, Delete) conforme necessário.


Descrição Geral
Este código cria um servidor HTTP utilizando o framework Express. O servidor gerencia rotas para criar, ler, atualizar e deletar registros na tabela empregados de um banco de dados. Ele também configura o middleware CORS para permitir solicitações de um cliente específico e utiliza dotenv para gerenciar variáveis de ambiente.

Código Documentado
javascript
Copiar código
import express from "express"; // Importa o módulo express para criação do servidor.
import cors from 'cors'; // Importa o módulo cors para habilitar o compartilhamento de recursos entre origens.
import { adminRouter } from "./Routes/AdminRoute.js"; // Importa o roteador para rotas administrativas.
import db from './utils/db.js'; // Importa a conexão com o banco de dados.
import 'dotenv/config'; // Importa as variáveis de ambiente.

const app = express(); // Cria uma instância do aplicativo Express.

// Configura o middleware CORS para permitir requisições de um domínio específico.
app.use(cors({
    origin: ["http://localhost:5173"], // Permite requisições somente do domínio especificado.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos.
    credentials: true // Permite o envio de cookies junto com as requisições.
}));

app.use(express.json()); // Middleware para fazer o parsing de JSON no corpo das requisições.

// Configura as rotas administrativas usando o roteador importado.
app.use('/auth', adminRouter);

// Rota para criar um novo registro de empregado.
app.post("/create", (req, res) => {
    const data = req.body.data; // Captura o dado enviado no corpo da requisição.
    const revisao = req.body.revisao; // Captura a revisão do documento.
    const codigo = req.body.codigo; // Captura o código do empregado.
    const validade = req.body.validade; // Captura a validade do documento.
    const responsavel = req.body.responsavel; // Captura o responsável pelo documento.
    const registro = req.body.registro; // Captura o registro profissional.

    // Realiza a inserção no banco de dados.
    db.query('INSERT INTO empregados(data, revisao, codigo, validade, responsavel, registro) VALUES(?,?,?,?,?,?)',
        [data, revisao, codigo, validade, responsavel, registro],
        (err, result) => {
            if(err) {
                console.log(err); // Registra erro no console caso ocorra.
            } else {
                res.send(result); // Retorna o resultado da inserção.
            }
        }
    );
});

// Rota para buscar todos os registros de empregados.
app.get("/empregados", (req, res) => {
    // Realiza a consulta no banco de dados.
    db.query('SELECT * FROM empregados',
        (err, result) => {
            if(err) {
                console.log(err); // Registra erro no console caso ocorra.
            } else {
                res.send(result); // Retorna os resultados da consulta.
            }
        }
    );
});

// Rota para atualizar um registro de empregado existente.
app.put("/update", (req, res) => {
    const id = req.body.id; // Captura o ID do empregado a ser atualizado.
    const data = req.body.data; // Captura os novos dados.
    const revisao = req.body.revisao; // Captura a nova revisão.
    const codigo = req.body.codigo; // Captura o novo código.
    const validade = req.body.validade; // Captura a nova validade.
    const responsavel = req.body.responsavel; // Captura o novo responsável.
    const registro = req.body.registro; // Captura o novo registro.

    // Realiza a atualização no banco de dados.
    db.query('UPDATE empregados SET data=?, revisao=?, codigo=?, validade=?, responsavel=?, registro=? WHERE id=?',
        [data, revisao, codigo, validade, responsavel, registro, id],
        (err, result) => {
            if(err) {
                console.log(err); // Registra erro no console caso ocorra.
            } else {
                res.send(result); // Retorna o resultado da atualização.
            }
        }
    );
});

// Rota para deletar um registro de empregado baseado no ID.
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id; // Captura o ID do empregado a ser deletado.
  
    // Realiza a exclusão no banco de dados.
    db.query('DELETE FROM empregados WHERE id=?', id,
        (err, result) => {
            if(err) {
                console.log(err); // Registra erro no console caso ocorra.
            } else {
                res.send(result); // Retorna o resultado da exclusão.
            }
        }
    );
});

// Configura o servidor para escutar em uma porta especificada por variável de ambiente ou na porta 3000.
app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`); // Exibe mensagem no console informando a porta do servidor.
});
Explicação Detalhada
Imports:

express: Utilizado para criar o servidor web e definir rotas.
cors: Middleware que permite o compartilhamento de recursos entre diferentes origens.
adminRouter: Importa o roteador que gerencia rotas administrativas.
db: Importa a configuração de conexão ao banco de dados.
dotenv/config: Carrega as variáveis de ambiente do arquivo .env.
Configuração do Express:

Uma instância do aplicativo Express é criada.
O middleware CORS é configurado para permitir solicitações do cliente em http://localhost:5173 e aceita métodos HTTP específicos (GET, POST, PUT, DELETE).
O middleware express.json() é usado para analisar o corpo das requisições no formato JSON.
Rotas:

POST /create: Insere um novo registro de empregado na tabela empregados. Recebe dados no corpo da requisição.
GET /empregados: Retorna todos os registros da tabela empregados.
PUT /update: Atualiza um registro existente na tabela empregados. Recebe o ID e os novos dados no corpo da requisição.
DELETE /delete/:id: Deleta um registro da tabela empregados com base no ID passado como parâmetro na URL.
Conexão com o Banco de Dados:

Cada operação de banco de dados é realizada utilizando a conexão importada. Os resultados das consultas e operações são retornados como resposta ao cliente.
Erros durante as operações de banco de dados são registrados no console.
Inicialização do Servidor:

O servidor escuta na porta especificada nas variáveis de ambiente ou na porta 3000. Uma mensagem de confirmação é exibida no console ao iniciar o servidor.
Considerações de Segurança
Validação de Dados: O código não possui validação de entrada para os dados recebidos nas requisições. É recomendável implementar validações para evitar inserções e atualizações inválidas ou maliciosas.
Tratamento de Erros: O tratamento de erros é básico e pode ser melhorado. Seria interessante retornar mensagens de erro mais específicas para o cliente.
Autenticação e Autorização: A autenticação e a autorização não estão implementadas neste código. Para um sistema mais seguro, é importante garantir que apenas usuários autorizados possam acessar e modificar dados.
Esse código fornece uma base sólida para gerenciar registros de empregados, permitindo operações de CRUD e estabelecendo uma comunicação básica entre o cliente e o servidor.

Dependências de Produção
@testing-library/jest-dom: ^5.17.0
@testing-library/react: ^13.4.0
@testing-library/user-event: ^13.5.0
axios: ^1.7.5
bcrypt: ^5.1.1
bcryptjs: ^2.4.3
bootstrap: ^5.3.3
cookie-parser: ^1.4.6
cors: ^2.8.5
dotenv: ^16.4.5
express: ^4.21.0
html2canvas: ^1.4.1
html2pdf.js: ^0.10.2
jsonwebtoken: ^9.0.2
jspdf: ^2.5.1
multer: ^1.4.5-lts.1
mysql: ^2.18.1
mysql2: ^3.11.3
nodemon: ^3.1.7
path: ^0.12.7
qrcode.react: ^4.0.1
react: ^18.3.1
react-bootstrap: ^2.10.4
react-dom: ^18.3.1
react-router-dom: ^6.26.1
react-scripts: ^5.0.1
sweetalert2: ^11.12.4
web-vitals: ^2.1.4
Dependências de Desenvolvimento
@types/mysql: ^2.15.26
@types/qrcode.react: ^1.0.5
@types/react: ^18.3.9
@types/react-dom: ^18.3.0
@types/react-router-dom: ^5.3.3
Observações
As dependências de produção são aquelas necessárias para a execução do seu aplicativo, enquanto as dependências de desenvolvimento são usadas durante o desenvolvimento e testes, mas não são necessárias em produção.
O nodemon é uma ferramenta útil durante o desenvolvimento que reinicia automaticamente o servidor quando há alterações no código.
Se você precisar de mais informações sobre alguma dessas dependências ou como usá-las, fique à vontade para perguntar!