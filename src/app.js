import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Variáveis globais
const users = [];
const tweets = [];

app.get("/tweets", (req, res) => {
    const { page } = req.query;

    let start = 0;
    let end = 10;

    if (page && (+ page) < 1) {
        res.status(400).send("Informe uma página válida!");
        return;
    }

    if (page && (+ page) > 1) {
        end = 10 * (+ page);
        start = end / 2;
    }

    const posts = [];
    const pageTweets = [...tweets].reverse().slice(start, end);

    pageTweets.forEach(item => {
        const user = users.find(({ username }) => username === item.username);

        const post = {
            username: item.username,
            avatar: user.avatar,
            tweet: item.tweet
        };

        posts.push(post);
    });

    res.send(posts);
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const userTweets = [];

    tweets.forEach(_tweet => {
        const userData = users.find(_user => _user.username === username);

        if (!userData) return res.status(404);

        if (userData.username === _tweet.username) {
            const userTweet = {
                username: userData.username,
                avatar: userData.avatar,
                tweet: _tweet.tweet
            };

            userTweets.push(userTweet);
        }
    });

    res.send(userTweets.reverse());
});

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    // Validar dados recebidos
    const invalidUsername = !username || typeof (username) !== "string";
    const invalidAvatar = !avatar || typeof (avatar) !== "string";

    if (invalidUsername || invalidAvatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const newUser = { username, avatar };

    users.push(newUser);
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;

    // validar dados recebidos
    const invalidUsername = !user || typeof (user) !== "string";
    const invalidTweet = !tweet || typeof (tweet) !== "string";

    if (invalidUsername || invalidTweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    // verificar se usuario existe
    const userExists = users.find(_user => _user.username === user);

    if (!userExists) {
        res.status(401).send("UNAUTHORIZED");
        return;
    }

    const newTweet = { username: user, tweet };

    tweets.push(newTweet);
    res.status(201).send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
