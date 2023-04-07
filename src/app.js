import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Variáveis globais
const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    const newUser = { username, avatar };

    users.push(newUser);
    res.send("OK");
});

app.listen(PORT, () => console.log(`Server rodando na porta: ${PORT}`));
