// import express from "express";
// import cors from 'cors';
// import { adminRouter } from "./Routes/AdminRoute.js";
// import db from './utils/db.js'; // Verifique se o caminho está correto
// import 'dotenv/config';

// const app = express();

// app.use(cors({
//     origin: [process.env.FRONTEND_URL], // Usa a URL do .env
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
// app.use(express.json());
// app.use('/auth', adminRouter);

// app.post("/create", (req, res) => {
//     const data = req.body.data;
//     const revisao = req.body.revisao;
//     const codigo = req.body.codigo;
//     const validade = req.body.validade;
//     const responsavel = req.body.responsavel;
//     const registro = req.body.registro;

//     db.query('INSERT INTO empregados( data, revisao, codigo, validade, responsavel, registro) VALUES(?,?,?,?,?,?)',[ data, revisao, codigo,validade, responsavel, registro],
//         (err, result) => {
//             if(err) {
//                 console.log(err);
//             }else {
//                 res.send(result);
//             }
//         }
//     );
// });


// //buscar retornando o body da requisição

// app.get("/empregados", (req, res) => {
//     db.query('SELECT * FROM empregados',
//         (err, result) => {
//             if(err) {
//                 console.log(err);
//             }else {
//                 res.send(result);
//             }
//         }
//     );
// });

// app.put("/update", (req, res) => {
//     const id = req.body.id;
//     const data = req.body.data;
//     const revisao = req.body.revisao;
//     const codigo = req.body.codigo;
//     const validade = req.body.validade;
//     const responsavel = req.body.responsavel;
//     const registro = req.body.registro;

//     db.query('UPDATE empregados SET data=?, revisao=?, codigo=?, validade=?, responsavel=?, registro=? WHERE id=?',[ data, revisao, codigo,validade, responsavel, registro, id],
//         (err, result) => {
//             if(err) {
//                 console.log(err);
//             }else {
//                 res.send(result);
//             }
//         }
//     );
// });

// app.delete("/delete/:id", (req, res) => {
//     const id = req.params.id;
  
//     db.query('DELETE FROM empregados  WHERE id=?',id,
//         (err, result) => {
//             if(err) {
//                 console.log(err);
//             }else {
//                 res.send(result);
//             }
//         }
//     );
// });

// app.listen(process.env.PORT || 3000, () => {
//     console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
// });

import express from "express";
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from "./Routes/AdminRoute.js";
import db from './utils/db.js';
import 'dotenv/config';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer (upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'certificados');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
const upload = multer({ storage });

// CORS para o frontend
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/auth', adminRouter);

// Serve os PDFs da pasta certificados
app.use('/pdf', express.static(path.join(__dirname, 'certificados')));

// Upload do PDF + salvar no banco
app.post('/upload-pdf/:id', upload.single('certificado'), (req, res) => {
    const id = req.params.id;
    const arquivoPDF = req.file.filename;

    db.query('UPDATE empregados SET arquivo_pdf=? WHERE id=?', [arquivoPDF, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao atualizar o caminho do PDF.");
        }
        res.send({ message: "Arquivo salvo com sucesso!", filename: arquivoPDF });
    });
});

// Rota pública para servir PDF por nome (se quiser permitir acesso direto por nome também)
app.get('/pdf/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'certificados', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send("Arquivo não encontrado.");
        }
    });
});

// Rota para criar empregado
app.post("/create", (req, res) => {
    const { data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'INSERT INTO empregados(data, revisao, codigo, validade, responsavel, registro) VALUES(?,?,?,?,?,?)',
        [data, revisao, codigo, validade, responsavel, registro],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erro ao criar certificado.");
            } else {
                res.send(result);
            }
        }
    );
});

// Consultar todos os empregados
app.get("/empregados", (req, res) => {
    db.query('SELECT * FROM empregados',
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erro ao buscar dados.");
            } else {
                res.send(result);
            }
        }
    );
});

// Atualizar empregado
app.put("/update", (req, res) => {
    const { id, data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'UPDATE empregados SET data=?, revisao=?, codigo=?, validade=?, responsavel=?, registro=? WHERE id=?',
        [data, revisao, codigo, validade, responsavel, registro, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erro ao atualizar dados.");
            } else {
                res.send(result);
            }
        }
    );
});

// Deletar empregado
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM empregados WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erro ao deletar registro.");
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
