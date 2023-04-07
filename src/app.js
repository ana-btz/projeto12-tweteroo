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

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;
    const userExists = users.find(user => user.username === username);

    if (!userExists) {
        res.send("UNAUTHORIZED");
    }

    const newTweet = { tweet };

    tweets.push(newTweet);
    res.send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
