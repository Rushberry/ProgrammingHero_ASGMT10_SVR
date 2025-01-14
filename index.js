require("dotenv").config();
const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId, ServerDescription } = require('mongodb');
const port = process.env.PORT || 1500;

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB 
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = `mongodb+srv://${username}:${password}@user-management-server.kivdz.mongodb.net/?retryWrites=true&w=majority&appName=User-Management-Server`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // await client.connect();
        const database = client.db("chillGameDB");
        const gamerBase = database.collection("games");
        const watchListBase = database.collection("watchList");

        app.get('/', (req, res) => {
            res.send('Chill Gamer: A Game Review Application Server')
        })

        app.post('/addReview', async (req, res) => {
            const response = req.body;
            const result = await gamerBase.insertOne(response)
            res.send(result)
        })

        app.post('/myReviews', async (req, res) => {
            const email = req.body;
            const query = email;
            const result = await gamerBase.find(query).toArray()
            res.send(result)
        })

        app.post('/myWatchlist', async (req, res) => {
            const email = req.body;
            const query = email;
            const result = await watchListBase.find(query).toArray()
            res.send(result)
        })

        app.post('/addWatchlist', async (req, res) => {
            const response = req.body;
            const result = await watchListBase.insertOne(response)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const result = await gamerBase.find().toArray()
            res.send(result)
        })

        app.get('/highRated', async (req, res) => {
            const result = await gamerBase.find().sort({ rating: -1 }).limit(6).toArray()
            res.send(result)
        })


        app.get('/latest', async (req, res) => {
            const result = await gamerBase.find().sort({ publishedDate: -1 }).limit(3).toArray()
            res.send(result)
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await gamerBase.find(query).toArray()
            res.send(result)
        })

        app.put('/updateReview/:id', async (req, res) => {
            const game = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedGame = {
                $set: {
                    thumbnail: game.thumbnail,
                    gameName: game.gameName,
                    rating: game.rating,
                    publishedDate: game.publishedDate,
                    genres: game.genres,
                    description: game.description,
                }
            }
            const result = await gamerBase.updateOne(filter, updatedGame, options)
            res.send(result)
        })

        app.get('/adventure', async (req, res) => {
            const query = { genres: "Adventure" }
            const result = await gamerBase.find(query).toArray()
            res.send(result)
        })
        app.get('/rpg', async (req, res) => {
            const query = { genres: "RPG" }
            const result = await gamerBase.find(query).toArray()
            res.send(result)
        })
        app.get('/action', async (req, res) => {
            const query = { genres: "Action" }
            const result = await gamerBase.find(query).toArray()
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await gamerBase.deleteOne(query);
            res.send(result)
        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB <3");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running at PORT: ${port}`)
})