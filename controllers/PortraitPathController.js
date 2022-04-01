const asyncMysql = require('../infrastructure/asyncConnection');

class PortraitPathController {

    static async create(req, res) {
        const path = req.body;
        const query = "INSERT INTO portraitpath SET ?;";

        try {
            const db = await asyncMysql();

            if(path.path == "") {
                throw new Error("Column 'path' cannot be null");
            }

            const verifyCharacter = await db.query(`SELECT * FROM portraitpath WHERE path='${path.path}'`);
            if(verifyCharacter[0].length > 0) {
                throw new Error(`The image '${path.path}' already exists`);
            }

            const values = { "path" : path.path };

            const result = await db.query(query, values)
            const pathId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": pathId
            })
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async readAll(req, res) {
        
        const query = "SELECT * FROM portraitpath";

        try {
            
            const db = await asyncMysql();

            const paths = await db.query(query);
            await db.end();
            return res.json(paths[0]);

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }

    static async readOne(req, res) {
        
        const query = "SELECT * FROM portraitpath WHERE id=?";

        try {

            const id = req.params.id;
            const db = await asyncMysql();

            const path = await db.query(query, id);
            await db.end();
            return res.json(path[0][0]);

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }
}
module.exports = PortraitPathController;