const express = require('express');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykyx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("All_Travel_DB");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("Orders");

        // GET API Display All Packages
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const tourPackage = await cursor.toArray();
            res.send(tourPackage);
        });
        // GET API Display All Orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //GET Single Package API
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tourPackage = await packageCollection.findOne(query);
            res.send(tourPackage);
        })

        // Get My Order
        app.get("/order/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // POST API Add Package
        app.post('/addpackage', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.send(result);
        });

        // POST API Order Package
        app.post('/orderpackage', async (req, res) => {
            const newPackage = req.body;
            const result = await orderCollection.insertOne(newPackage);
            res.send(result);
        });

        // Delete Order
        app.delete('/deleteOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running Server")
})

app.listen(port, () => {
    console.log(`Example app listening at Port:${port}`)
})
