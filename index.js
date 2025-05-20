import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import db from './utils/db.js'; // Verifique se o caminho está correto
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL], // Usa a URL do .env
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/auth', adminRouter);

// ✅ NOVA ROTA PARA BUSCAR CERTIFICADO PELO CÓDIGO (usado pelo QR Code)
app.get('/api/certificados/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM empregados WHERE codigo = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro na consulta:", err);
            return res.status(500).json({ error: "Erro ao buscar certificado." });
        }

        if (result.length > 0) {
            return res.json(result[0]);
        } else {
            return res.status(404).json({ error: "Certificado não encontrado." });
        }
    });
});

// Criação de novo certificado
app.post("/create", (req, res) => {
    const { data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'INSERT INTO empregados(data, revisao, codigo, validade, responsavel, registro) VALUES (?, ?, ?, ?, ?, ?)',
        [data, revisao, codigo, validade, responsavel, registro],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Listagem de todos os certificados
app.get("/empregados", (req, res) => {
    db.query('SELECT * FROM empregados', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Atualização de um certificado
app.put("/update", (req, res) => {
    const { id, data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'UPDATE empregados SET data=?, revisao=?, codigo=?, validade=?, responsavel=?, registro=? WHERE id=?',
        [data, revisao, codigo, validade, responsavel, registro, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Exclusão de um certificado
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM empregados WHERE id=?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Inicialização do servidor
app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
