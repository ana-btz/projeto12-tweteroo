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
            username: user.username,
            avatar: user.avatar,
            tweet: item.tweet
        };

        posts.push(post);
    });

    res.send(posts);
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const user_tweets = [];

    tweets.forEach(tweet_obj => {
        const user_data_obj = users.find(user_obj => user_obj.username === username);

        if (!user_data_obj) return res.status(404);

        if (user_data_obj.username === tweet_obj.username) {
            const user_tweet = {
                username: user_data_obj.username,
                avatar: user_data_obj.avatar,
                tweet: tweet_obj.tweet
            };

            user_tweets.push(user_tweet);
        }
    });

    res.send(user_tweets.reverse());
});

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    // Validar dados recebidos
    const invalid_username = !username || typeof (username) !== "string";
    const invalid_avatar = !avatar || typeof (avatar) !== "string";

    if (invalid_username || invalid_avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const newUser = { username, avatar };

    users.push(newUser);
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    // validar dados recebidos
    const invalid_username = !username || typeof (username) !== "string";
    const invalid_tweet = !tweet || typeof (tweet) !== "string";

    if (invalid_username || invalid_tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    // verificar se usuario existe
    const userExists = users.find(user => user.username === username);

    if (!userExists) {
        res.status(401).send("UNAUTHORIZED");
        return;
    }

    const newTweet = { username, tweet };

    tweets.push(newTweet);
    res.status(201).send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
