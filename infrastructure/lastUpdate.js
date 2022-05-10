const asyncMysql = require('../infrastructure/asyncConnection');

async function lastUpdate(query, res) {
    try {
        const db = await asyncMysql();

        const results = await db.query(query);
        const lastUpdate = results[0][0];

        await db.end();
        return res.json({ "lastUpdate": lastUpdate["max(createdAt)"] });

    } catch(error) {
        return res.status(500).json({ "Error message": error.message });
    }
}

module.exports = lastUpdate