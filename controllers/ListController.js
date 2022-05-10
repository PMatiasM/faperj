const asyncMysql = require('../infrastructure/asyncConnection');
const axios = require('axios');
const lastUpdate = require('../infrastructure/lastUpdate');

class ListController {
    static async create(req, res) {

        const questionList = req.body;
        const query = 'INSERT INTO lists SET ?';
        const idList = [];
        
        try {
            const db = await asyncMysql();

            for(const question of questionList.questions) {
                const response = await axios.post('http://localhost:31415/questions', question);
                idList.push(response.data.id);
            }

            if(questionList.title == "") {
                throw new Error("Column 'title' cannot be null");
            }

            const verifyTitle = await db.query(`SELECT * FROM lists WHERE title='${questionList.title}'`);
            if(verifyTitle[0].length > 0) {
                throw new Error(`The title '${questionList.title}' already exists`);
            }

            const values = {
                "title" : questionList.title,
                "description" : questionList.description,
                "questions" : JSON.stringify(idList)
            }

            const result = await db.query(query, values)
            const listId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": listId
            })
        } catch(error) {
            if(error.response) {
                res.status(500).json(error.response.data);
            } else {
                res.status(500).json({ "Error message": error.message });
            }
        }
    }

    static async readAll(req, res) {
        try{
            const allLists = []

            const db = await asyncMysql();
            const query = 'SELECT * FROM lists'

            const results = await db.query(query);
            const lists = results[0]

            for(const list of lists) {
                const questionList = [];

                const themeIdlist = [];
                const characterIdlist = [];

                const themeList = [];
                const characterList = [];

                for(const questionId of list.questions) {
                    const question = await axios.get(`http://localhost:31415/questions/id/${questionId}`);
                    questionList.push(question.data);
                    themeIdlist.push(question.data.themeId);
                    characterIdlist.push(question.data.characterId)
                }

                const uniqueThemes = [ ...new Set(themeIdlist)]
                const uniqueCharacters = [ ...new Set(characterIdlist)]

                
                for(const theme of uniqueThemes) {
                    const result = await axios.get(`http://localhost:31415/themes/id/${theme}`);
                    themeList.push(result.data)
                }
                for(const character of uniqueCharacters) {
                    const result = await axios.get(`http://localhost:31415/characters/id/${character}`);
                    characterList.push(result.data)
                }

                allLists.push({
                    "id" : list.id,
                    "title" : list.title,
                    questionList,
                    themeList,
                    characterList,
                    "description" : list.description
                })
            }
            
            res.json(allLists);
        } catch(error) {
            if(error.response) {
                res.status(500).json(error.response.data);
            } else {
                res.status(500).json({ "Error message": error.message });
            }
        } 
    }

    static async readOne(req, res) {
        try{
            const id = req.params.id;
            
            const db = await asyncMysql();
            const query = 'SELECT * FROM lists WHERE id=?'

            const results = await db.query(query, id);
            const list = results[0][0];
            
            if(!list) {
                throw new Error(`Id ${id} list does not exist`);
            }

            const questionList = [];

            const themeIdlist = [];
            const characterIdlist = [];

            const themeList = [];
            const characterList = [];

            for(const questionId of list.questions) {
                const question = await axios.get(`http://localhost:31415/questions/id/${questionId}`);
                questionList.push(question.data)
                themeIdlist.push(question.data.themeId);
                characterIdlist.push(question.data.characterId)
            }

            const uniqueThemes = [ ...new Set(themeIdlist)]
            const uniqueCharacters = [ ...new Set(characterIdlist)]

            
            for(const theme of uniqueThemes) {
                const result = await axios.get(`http://localhost:31415/themes/id/${theme}`);
                themeList.push(result.data)
            }
            for(const character of uniqueCharacters) {
                const result = await axios.get(`http://localhost:31415/characters/id/${character}`);
                characterList.push(result.data)
            }

            res.json({
                "id" : list.id,
                "title" : list.title,
                questionList,
                themeList,
                characterList,
                "description" : list.description
            });
        } catch(error) {
            if(error.response) {
                res.status(500).json(error.response.data);
            } else {
                res.status(500).json({ "Error message": error.message });
            }
        } 
    }

    static async readAllPreview(req, res) {
        try{
            const allLists = []

            const db = await asyncMysql();
            const query = 'SELECT * FROM lists'

            const results = await db.query(query);
            const lists = results[0]

            for(const list of lists) {
                allLists.push({
                    "id" : list.id,
                    "title" : list.title,
                    "description" : list.description
                })
            }
            
            res.json({ "list": allLists });
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        } 
    }

    static async lastUpdate(req, res) {
        const query = "SELECT max(createdAt) FROM lists";

        lastUpdate(query, res);
    }
}
module.exports = ListController;