require("dotenv").config();
const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        await client.connect();

        app.get('/', (req, res) => {
            res.send('Chill Gamer: A Game Review Application')
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running at PORT: ${port}`)
})