const asyncMysql = require('../infrastructure/asyncConnection');
const axios = require('axios');
const lastUpdate = require('../infrastructure/lastUpdate');

class CharacterController {

    static async create(req, res) {
        const character = req.body;
        const query = "INSERT INTO characterlist SET ?;";

        try {
            const db = await asyncMysql();

            if(character.charName == "") {
                throw new Error("Column 'charName' cannot be null");
            }

            if(character.portraitURL == "") {
                character.portraitURL = null;
            }

            const dbVerifyCharacter = await db.query(`SELECT * FROM characterlist WHERE charName='${character.charName}' AND portraiturl='${character.portraitURL}'`);
            const verifyCharacter = dbVerifyCharacter[0][0];
            if(verifyCharacter) {
                return res.json({
                    "Status": "Found",
                    "id": verifyCharacter.id
                })
            }

            const values = {
                "charName" : character.charName,
                "portraiturl": character.portraitURL
            };

            const result = await db.query(query, values)
            const characterId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": characterId
            })
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async readAll(req, res) {
        
        const query = "SELECT * FROM characterlist";

        try {
            
            const db = await asyncMysql();

            const results = await db.query(query);
            const characters = results[0];

            for(const character of characters) {
                const charName = await axios.get(`http://localhost:31415/names/id/${character.charName}`);
                const portraitURL = await axios.get(`http://localhost:31415/paths/id/${character.portraitURL}`);
                character.charName = charName.data.name;
                character.portraitURL = portraitURL.data.path;
            }

            await db.end();
            return res.json({ "list": characters });

        } catch(error) {
            if(error.response) {
                res.status(500).json(error.response.data);
            } else {
                res.status(500).json({ "Error message": error.message });
            }
        }
    }

    static async readOne(req, res) {
        
        const query = "SELECT * FROM characterlist WHERE id=?";

        try {

            const id = req.params.id;
            const db = await asyncMysql();
            
            const results = await db.query(query, id);
            const character = results[0][0];

            if(character) {
                const charName = await axios.get(`http://localhost:31415/names/id/${character.charName}`);
                const portraitURL = await axios.get(`http://localhost:31415/paths/id/${character.portraitURL}`);
                character.charName = charName.data.name;
                character.portraitURL = portraitURL.data.path;
            } else {
                throw new Error(`Id ${id} character does not exist`);
            }

            await db.end();
            return res.json(character);

        } catch(error) {
            if(error.response) {
                res.status(500).json(error.response.data);
            } else {
                res.status(500).json({ "Error message": error.message });
            }
        }
    }

    static async lastUpdate(req, res) {
        const query = "SELECT max(createdAt) FROM characterlist";

        try {

            const db = await asyncMysql();
            
            const results = await db.query(query);
            const lastUpdate = results[0][0];

            await db.end();
            return res.json({ "lastUpdate": lastUpdate["max(createdAt)"] });

        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async lastUpdate(req, res) {
        const query = "SELECT max(createdAt) FROM characterlist";

        lastUpdate(query, res);
    }
}
module.exports = CharacterController;