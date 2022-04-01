const asyncMysql = require('../infrastructure/asyncConnection');

class CharNameController {

    static async create(req, res) {
        const name = req.body;
        const query = "INSERT INTO charname SET ?;";

        try {
            const db = await asyncMysql();

            if(name.name == "") {
                throw new Error("Column 'name' cannot be null");
            }

            const verifyCharacter = await db.query(`SELECT * FROM charname WHERE name='${name.name}'`);
            if(verifyCharacter[0].length > 0) {
                throw new Error(`The charName '${name.name}' already exists`);
            }

            const values = { "name" : name.name };

            const result = await db.query(query, values)
            const nameId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": nameId
            })
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async readAll(req, res) {
        
        const query = "SELECT * FROM charname";

        try {
            
            const db = await asyncMysql();

            const names = await db.query(query);
            await db.end();
            return res.json(names[0]);

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }

    static async readOne(req, res) {
        
        const query = "SELECT * FROM charname WHERE id=?";

        try {

            const id = req.params.id;
            const db = await asyncMysql();

            const name = await db.query(query, id);
            await db.end();
            return res.json(name[0][0]);

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }
}
module.exports = CharNameController;