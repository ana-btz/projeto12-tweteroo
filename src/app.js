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
    if (tweets.length === 0) return res.send(tweets);
    const posts = [];
    let count = 0;

    for (let i = tweets.length - 1; i >= 0; i--) {
        for (let j = 0; j < users.length; j++) {
            if (users[j].username === tweets[i].username && count < 10) {
                const post = {
                    username: users[j].username,
                    avatar: users[j].avatar,
                    tweet: tweets[i].tweet
                };

                posts.push(post);
                count++;
            }
        }
    }

    res.send(posts);
});

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
        return res.send("UNAUTHORIZED");
    }

    const newTweet = { username, tweet };

    tweets.push(newTweet);
    res.send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
