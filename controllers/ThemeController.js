const asyncMysql = require('../infrastructure/asyncConnection');

class ThemeController {

    static async create(req, res) {
        const theme = req.body;
        const query = "INSERT INTO themelist SET ?;";

        try {
            const db = await asyncMysql();

            if(theme.theme == "") {
                throw new Error("Column 'theme' cannot be null");
            }

            const verifyTheme = await db.query(`SELECT * FROM themelist WHERE theme='${theme.theme}'`);
            if(verifyTheme[0].length > 0) {
                throw new Error(`The Theme '${theme.theme}' already exists`);
            }

            const values = { "theme" : theme.theme };

            const result = await db.query(query, values)
            const themeId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": themeId
            })
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async readAll(req, res) {
        
        const query = "SELECT * FROM themelist";

        try {

            const db = await asyncMysql();

            const themes = await db.query(query);
            await db.end();
            return res.json({ "list": themes[0] });

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }

    static async readOne(req, res) {
        const id = req.params.id;
        const query = "SELECT * FROM themelist WHERE id=?";

        try {

            const db = await asyncMysql();

            const theme = await db.query(query, id);
            await db.end();
            return res.json(theme[0][0]);

        } catch(error) {
            return res.status(500).json({ "Error message": error.message });
        }
    }

    static async lastUpdate(req, res) {
        const query = "SELECT max(createdAt) FROM themelist";

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
}
module.exports = ThemeController;