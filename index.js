require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.mhhrtuq.mongodb.net/?appName=Cluster1`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

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

        const db = client.db('cyber_it');
        const courseCollection = db.collection('course');

        app.post('/course', async (req, res) => {
            const newCourse = req.body;
            const result = await courseCollection.insertOne(newCourse);
            res.send(result)
        })

        app.get('/course', async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (email) {
                query = { addedBy: email };
            }

            const cursor = courseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.findOne(query);
            res.send(result)
        })

        app.delete('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.deleteOne(query);

            if (result.deletedCount > 0) {
                res.send({ success: true, message: "Course deleted" });
            } else {
                res.send({ success: false, message: "Course not found" });
            }
        });


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})