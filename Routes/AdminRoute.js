// import express from 'express';
// import con from '../utils/db.js';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// router.post('/adminlogin', (req, res) => {
//     const sql = "SELECT * from admin Where email = ? and password = ?"
//     con.query(sql,[req.body.email, req.body.password], (err, result) => {
//         if (err) return res.json({ loginStatus: false, Error: "Query error" })
//         if (result.length > 0) {
//             const email = result[0].email;
//             const token = jwt.sign({role: "admin", email: email}, "jwt_secret_key", { expiresIn: '1d' }); 

//             res.cookie('token', token);
//             return res.json({ loginStatus: true });
//         } else {
//             return res.json({ loginStatus: false, Error: "Senha ou email incorretos!" });
//         }
//     });
// });



// export { router as adminRouter }

import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Configuração do multer para armazenamento temporário
const upload = multer({ dest: 'uploads/' });

// Login admin (seu código existente)
router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin Where email = ? and password = ?";
    con.query(sql,[req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({role: "admin", email: email}, "jwt_secret_key", { expiresIn: '1d' }); 

            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Senha ou email incorretos!" });
        }
    });
});


// Rota para upload do PDF
router.post('/upload-pdf', upload.single('pdf'), (req, res) => {
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
        con.query(sql, [codigo, data, req.file.originalname], (err2, result) => {
            // Apagar arquivo temporário
            fs.unlink(req.file.path, () => {});

            if (err2) {
                console.error(err2);
                return res.status(500).json({ error: 'Erro ao salvar PDF no banco' });
            }

            // Retornar a URL onde o PDF pode ser acessado (você precisará configurar isso no front e backend)
            const url = `${req.protocol}://${req.get('host')}/api/pdf/${codigo}`;
            return res.json({ url });
        });
    });
});

// Rota para servir PDF do banco
router.get('/pdf/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const sql = 'SELECT pdf_blob, filename FROM certificados WHERE codigo = ? ORDER BY created_at DESC LIMIT 1';
    con.query(sql, [codigo], (err, results) => {
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

export { router as adminRouter };
