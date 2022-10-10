import nextConnect from 'next-connect';
import { connectToDatabase } from 'utils/mongo_db';

async function database(req, res, next) {
    const { client, db } = await connectToDatabase()

    req.dbClient = client
    req.db = db

    return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware