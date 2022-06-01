require('dotenv').config();
var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const uri = process.env.MONGOURL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get("/books", async (req, res, next) => {
    try {
        var conn = await establishDBConnection("Bookshelf0", "Shelf0");
        var books = await conn.collection.find({}).toArray();
        res.json(books);
        conn.client.close();
    } catch (err) {
        console.log("Err " + err);
        next(err);
        conn.client.close();
    }
});

app.post("/book", async (req, res, next) => {
    try {
        const book = req.body;
        var conn = await establishDBConnection("Bookshelf0", "Shelf0");
        var result = await conn.collection.insertOne(book);
        res.send(result);
        conn.client.close();
    } catch (err) {
        console.log("An error occurred " + err);
        next(err);
        conn.client.close();
    }
});

app.put("/book", async (req, res, next) => {
    try {
        const book = req.body;
        console.log(JSON.stringify(book))
        var conn = await establishDBConnection("Bookshelf0", "Shelf0");
        const filter = { _id: ObjectId(book._id) }
        const doc = {
            $set: {
                title: book.title,
                author: book.author
            },
        }
        var result = await conn.collection.updateOne(filter, doc);
        res.send(result);
        conn.client.close();
    } catch (err) {
        console.log(err);
        next(err);
        conn.client.close();
    }
});

app.delete("/book", async (req, res, next) => {
    try {
        const book = req.body;
        console.log(JSON.stringify(book))
        var conn = await establishDBConnection("Bookshelf0", "Shelf0");
        const filter = { _id: ObjectId(book._id) }
        var result = await conn.collection.deleteOne(filter);
        res.send(result);
        conn.client.close();
    } catch (err) {
        console.log(err);
        next(err);
        conn.client.close();
    }
})

function establishDBConnection(dbName, collName) {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            var db = client.db(dbName);
            var collection = db.collection(collName);
            var connObj = { client: client, db: db, collection: collection }
            resolve(connObj);
        } catch (err) {
            conn.client.close();
            reject(err);
        }
    });
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

