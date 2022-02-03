import { MongoClient } from "mongodb"
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient = null;
let cachedDb = null;

var clientCounter = 0

export async function connectToDatabase() {

    
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb
        }
    }

    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    clientCounter += 1
    console.log(`Creating new mongoClient. Current count: ${clientCounter}`)
    let client = new MongoClient(MONGODB_URI, opts)
    await client.connect()
    let db = client.db(MONGODB_DB)

    cachedClient = client
    cachedDb = db

    return {
        client: cachedClient,
        db: cachedDb
    }

}