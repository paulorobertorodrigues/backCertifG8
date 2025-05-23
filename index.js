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
import { adminRouter } from "./Routes/AdminRoute.js";
import db from './utils/db.js'; // Verifique se o caminho está correto
import 'dotenv/config';
import multer from 'multer';
import fs from 'fs';

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL], // Usa a URL do .env
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar o adminRouter em /auth
app.use('/auth', adminRouter);

// Configuração multer para upload temporário
const upload = multer({ dest: 'uploads/' });

// Rota para upload do PDF e salvar no banco
app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo PDF não enviado' });
    }

    const codigo = req.body.codigo;
    if (!codigo) {
        return res.status(400).json({ error: 'Código do documento é obrigatório' });
    }

    // Ler arquivo temporário
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }

        // Inserir no banco
        const sql = 'INSERT INTO certificados (codigo, pdf_blob, filename, created_at) VALUES (?, ?, ?, NOW())';
        db.query(sql, [codigo, data, req.file.originalname], (err2, result) => {
            // Apagar arquivo temporário
            fs.unlink(req.file.path, () => {});

            if (err2) {
                console.error(err2);
                return res.status(500).json({ error: 'Erro ao salvar PDF no banco' });
            }

            // Retornar URL para acessar o PDF
            const url = `${req.protocol}://${req.get('host')}/pdf/${codigo}`;
            return res.json({ url });
        });
    });
});

// Rota para servir PDF armazenado no banco
app.get('/pdf/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const sql = 'SELECT pdf_blob, filename FROM certificados WHERE codigo = ? ORDER BY created_at DESC LIMIT 1';
    db.query(sql, [codigo], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar PDF');
        }
        if (results.length === 0) {
            return res.status(404).send('PDF não encontrado');
        }

        const pdf = results[0];
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdf.filename}"`);
        res.send(pdf.pdf_blob);
    });
});

// Suas rotas atuais CRUD empregados

app.post("/create", (req, res) => {
    const data = req.body.data;
    const revisao = req.body.revisao;
    const codigo = req.body.codigo;
    const validade = req.body.validade;
    const responsavel = req.body.responsavel;
    const registro = req.body.registro;

    db.query('INSERT INTO empregados( data, revisao, codigo, validade, responsavel, registro) VALUES(?,?,?,?,?,?)',[ data, revisao, codigo,validade, responsavel, registro],
        (err, result) => {
            if(err) {
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});

app.get("/empregados", (req, res) => {
    db.query('SELECT * FROM empregados',
        (err, result) => {
            if(err) {
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});

app.put("/update", (req, res) => {
    const id = req.body.id;
    const data = req.body.data;
    const revisao = req.body.revisao;
    const codigo = req.body.codigo;
    const validade = req.body.validade;
    const responsavel = req.body.responsavel;
    const registro = req.body.registro;

    db.query('UPDATE empregados SET data=?, revisao=?, codigo=?, validade=?, responsavel=?, registro=? WHERE id=?',[ data, revisao, codigo,validade, responsavel, registro, id],
        (err, result) => {
            if(err) {
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
  
    db.query('DELETE FROM empregados  WHERE id=?',id,
        (err, result) => {
            if(err) {
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});


app.get('/certificado/:codigo', (req, res) => {
    const codigo = req.params.codigo;

    const sql = 'SELECT * FROM empregados WHERE codigo = ? LIMIT 1';
    db.query(sql, [codigo], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar certificado');
        }

        if (results.length === 0) {
            return res.status(404).send('Certificado não encontrado');
        }

        const cert = results[0];

        // Retorna uma página HTML simples
        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Certificado ${cert.codigo}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto; }
                    h1 { color: #333; }
                    .campo { margin-bottom: 10px; }
                    .label { font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Certificado de Autenticidade</h1>
                <div class="campo"><span class="label">Código:</span> ${cert.codigo}</div>
                <div class="campo"><span class="label">Data:</span> ${new Date(cert.data).toLocaleDateString('pt-BR')}</div>
                <div class="campo"><span class="label">Revisão:</span> ${cert.revisao}</div>
                <div class="campo"><span class="label">Validade:</span> ${new Date(cert.validade).toLocaleDateString('pt-BR')}</div>
                <div class="campo"><span class="label">Responsável Técnico:</span> ${cert.responsavel}</div>
                <div class="campo"><span class="label">Registro Profissional:</span> CREA: ${cert.registro}</div>
                <br>
                <p>Este certificado foi verificado automaticamente por sistema online.</p>
            </body>
            </html>
        `;

        res.send(html);
    });
});
