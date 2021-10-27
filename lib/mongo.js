const { MongoClient } = require("mongodb");
const { Logger } = require("mongodb");

Logger.setLevel("error");

const state = {
    db: null,
};

const connect = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_DB_HOST, {
            useUnifiedTopology: true,
        });

        state.db = client.db(process.env.MONGODB_DB_NAME);
    } catch (err) {
        state.db = err;
    }
};

const getDb = () => state.db;

module.exports = {
    connect,
    getDb,
};
