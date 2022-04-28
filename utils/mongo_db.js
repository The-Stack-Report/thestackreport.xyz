import { MongoClient } from "mongodb"
import _ from "lodash"
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
    if(process.env.NODE_ENV !== 'production') {
        var globalCachedClient = _.get(global, "__cachedClient", false)
        var globalCachedDb = _.get(global, "__cachedDb", false)
        if(globalCachedClient && globalCachedDb) {
            console.log("using global cached client & db because not in production")
            return {
                client: globalCachedClient,
                db: globalCachedDb
            }
        }
    }
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
    let client = new MongoClient(MONGODB_URI, opts)
    await client.connect()
    let db = client.db(MONGODB_DB)

    cachedClient = client
    cachedDb = db
    if(process.env.NODE_ENV !== 'production') {
        console.log("setting global cached client & db because not in production.")
        global["__cachedClient"] = client
        global["__cachedDb"] = db
    }
    return {
        client: cachedClient,
        db: cachedDb
    }

}