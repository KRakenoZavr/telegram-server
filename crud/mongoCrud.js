const { getDb } = require("../lib/mongo");

// mongo generic crud
async function updateOne(collectionName, filter, update, params) {
    const col = getDb().collection(collectionName);
    const result = await col.updateOne(filter, update, params);
    return result;
}

async function findOne(collectionName, conditions, options) {
    const col = getDb().collection(collectionName);
    const result = await col.findOne(conditions, options);
    return result;
}

module.exports = {
    updateOne,
    findOne,
};
