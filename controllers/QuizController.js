const asyncMysql = require("../infrastructure/asyncConnection");
const axios = require("axios");
const lastUpdate = require("../infrastructure/lastUpdate");

class QuizController {
  static async create(req, res) {
    const quiz = req.body;
    const query = "INSERT INTO quiz SET ?";
    const idList = [];

    try {
      const db = await asyncMysql();

      for (const quizItem of quiz.itemList) {
        const response = await axios.post(
          "http://localhost:31415/quizItems",
          quizItem
        );
        idList.push(response.data.id);
      }

      if (quiz.title === "") {
        throw new Error("Column 'title' cannot be null");
      }

      if (quiz.description === "") {
        throw new Error("Column 'description' cannot be null");
      }

      const verifyTitle = await db.query(
        `SELECT * FROM quiz WHERE title='${quiz.title}'`
      );
      if (verifyTitle[0].length > 0) {
        throw new Error(`The title '${quiz.title}' already exists`);
      }

      const values = {
        title: quiz.title,
        itemList: JSON.stringify(idList),
        difficulty: quiz.difficulty,
        description: quiz.description,
      };

      const result = await db.query(query, values);
      const listId = result[0].insertId;
      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: listId,
      });
    } catch (error) {
      if (error.response) {
        res.status(500).json(error.response.data);
      } else {
        res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readAll(req, res) {
    try {
      const allQuizes = [];

      const db = await asyncMysql();
      const query = "SELECT * FROM quiz";

      const results = await db.query(query);
      const quizes = results[0];

      for (const quiz of quizes) {
        const itemList = [];

        for (const quizItem of quiz.itemList) {
          const item = await axios.get(
            `http://localhost:31415/quizItems/id/${quizItem}`
          );
          itemList.push(item.data);
        }

        allQuizes.push({
          id: quiz.id,
          title: quiz.title,
          itemList,
          difficulty: quiz.difficulty,
          description: quiz.description,
        });
      }

      res.json(allQuizes);
    } catch (error) {
      if (error.response) {
        res.status(500).json(error.response.data);
      } else {
        res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readOne(req, res) {
    try {
      const id = req.params.id;

      const db = await asyncMysql();
      const query = "SELECT * FROM quiz WHERE id=?";

      const results = await db.query(query, id);
      const quiz = results[0][0];

      if (!quiz) {
        throw new Error(`Id ${id} quiz does not exist`);
      }

      const itemList = [];

      for (const quizItem of quiz.itemList) {
        const item = await axios.get(
          `http://localhost:31415/quizItems/id/${quizItem}`
        );
        itemList.push(item.data);
      }

      res.json({
        id: quiz.id,
        title: quiz.title,
        itemList,
        difficulty: quiz.difficulty,
        description: quiz.description,
      });
    } catch (error) {
      if (error.response) {
        res.status(500).json(error.response.data);
      } else {
        res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readAllPreview(req, res) {
    try {
      const allQuizes = [];

      const db = await asyncMysql();
      const query = "SELECT * FROM quiz";

      const results = await db.query(query);
      const quizes = results[0];

      for (const quiz of quizes) {
        allQuizes.push({
          id: quiz.id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          description: quiz.description,
        });
      }

      res.json({ quiz: allQuizes });
    } catch (error) {
      res.status(500).json({ "Error message": error.message });
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM quiz";

    lastUpdate(query, res);
  }
}

module.exports = QuizController;
