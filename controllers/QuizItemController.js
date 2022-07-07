const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class QuizItemController {
  static async create(req, res) {
    const item = req.body;
    const query = "INSERT INTO quizitem SET ?";

    try {
      const db = await asyncMysql();

      const values = {
        listId: item.listId,
        description: item.description,
        requiredHits: item.requiredHits,
      };

      const dbVerifyItem = await db.query(
        `SELECT * FROM quizitem WHERE listId = ${item.listId} AND description = "${item.description}" AND requiredHits = ${item.requiredHits}`
      );
      const verifyItem = dbVerifyItem[0];
      if (verifyItem.length > 0) {
        await db.end();
        return res.json({
          Status: "Found",
          id: verifyItem[0].id,
        });
      }

      const result = await db.query(query, values);
      const itemId = result[0].insertId;

      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: itemId,
      });
    } catch (error) {
      res.status(500).json({ "Error message": error.message });
    }
  }

  static async readAll(req, res) {
    const query = "SELECT * FROM quizitem";

    try {
      const db = await asyncMysql();

      const items = await db.query(query);
      await db.end();
      return res.json({ quizItems: items[0] });
    } catch (error) {
      return res.status(500).json({ "Error message": error.message });
    }
  }

  static async readOne(req, res) {
    const id = req.params.id;
    const query = "SELECT * FROM quizitem WHERE id=?";

    try {
      const db = await asyncMysql();

      const item = await db.query(query, id);
      await db.end();
      return res.json(item[0][0]);
    } catch (error) {
      return res.status(500).json({ "Error message": error.message });
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM quizitem";

    lastUpdate(query, res);
  }
}

module.exports = QuizItemController;
