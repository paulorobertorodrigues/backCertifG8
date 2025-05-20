import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Rota de login do admin
router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", email: email }, "jwt_secret_key", { expiresIn: '1d' });

            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Senha ou email incorretos!" });
        }
    });
});

// ✅ Rota para buscar certificado pelo ID (ex: código)
router.get('/certificados/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM certificados WHERE codigo = ?"; // ou use o nome da sua tabela

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro na consulta:", err);
            return res.status(500).json({ error: "Erro no servidor ao buscar certificado" });
        }

        if (result.length > 0) {
            return res.json(result[0]); // retorna o certificado encontrado
        } else {
            return res.status(404).json({ error: "Certificado não encontrado" });
        }
    });
});

export { router as adminRouter };
