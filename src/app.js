import express from "express";

const server = express();

server.get("/tweets", (req, res) => {
    const tweets = [
        {
            id: 1,
            name: "pafuncio",
            tweet: "Oi, eu sou o Pafúncio :)"
        }
    ]

    res.send(tweets);
})

server.listen(5000, () => {
    console.log("Servidor ON");
});