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

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL], // Usa a URL do .env
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/auth', adminRouter);

// Rota para criação de certificado
app.post("/create", (req, res) => {
    const { data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'INSERT INTO empregados (data, revisao, codigo, validade, responsavel, registro) VALUES (?, ?, ?, ?, ?, ?)',
        [data, revisao, codigo, validade, responsavel, registro],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao criar certificado.");
            } else {
                res.send(result);
            }
        }
    );
});

// Rota para listar todos os certificados
app.get("/empregados", (req, res) => {
    db.query('SELECT * FROM empregados', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao buscar certificados.");
        } else {
            res.send(result);
        }
    });
});

// Rota para atualizar certificado
app.put("/update", (req, res) => {
    const { id, data, revisao, codigo, validade, responsavel, registro } = req.body;

    db.query(
        'UPDATE empregados SET data = ?, revisao = ?, codigo = ?, validade = ?, responsavel = ?, registro = ? WHERE id = ?',
        [data, revisao, codigo, validade, responsavel, registro, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro ao atualizar certificado.");
            } else {
                res.send(result);
            }
        }
    );
});

// Rota para deletar certificado por ID
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM empregados WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao deletar certificado.");
        } else {
            res.send(result);
        }
    });
});

// ✅ NOVA ROTA: Buscar certificado por código (para QR Code)
app.get("/certificado/codigo/:codigo", (req, res) => {
  const codigo = req.params.codigo;

  db.query('SELECT * FROM empregados WHERE codigo = ?', [codigo], (err, result) => {
    if (err) return res.status(500).send("Erro ao buscar certificado.");
    if (result.length === 0) return res.status(404).send("Certificado não encontrado.");
    res.send(result[0]); // Retorna os dados do certificado
  });
});

// Iniciar o servidor
app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
