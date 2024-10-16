import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json()); // Para entender o corpo JSON

app.post("/your-api-endpoint", (req, res) => {
    console.log(req.body); // Aqui estão os dados extraídos do PDF
    // Você pode processar os dados como necessário

    // Envie uma resposta JSON
    res.json({ message: "Dados recebidos com sucesso!", data: req.body });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
