const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class ScenarioLineController {
  static async create(req, res) {
    const line = req.body;
    const query = "INSERT INTO scenarioline SET ?";

    try {
      const db = await asyncMysql();

      if (line.prompt === "") {
        throw new Error("Column 'prompt' cannot be null");
      }

      const values = {
        prompt: line.prompt,
        optionList: line.optionList,
        character: line.character,
      };

      const result = await db.query(query, values);
      const lineId = result[0].insertId;
      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: lineId,
      });
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readAll(req, res) {
    try {
      const db = await asyncMysql();
      const query = "SELECT * FROM scenarioline";

      const results = await db.query(query);
      const lines = results[0];

      return res.json(lines);
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readOne(req, res) {
    try {
      const id = req.params.id;

      const db = await asyncMysql();
      const query = "SELECT * FROM scenarioline WHERE id=?";

      const result = await db.query(query, id);
      const line = result[0][0];

      if (!line) {
        throw new Error(`Id ${id} scenarioline does not exist`);
      }

      return res.json(line);
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM scenarioline";

    lastUpdate(query, res);
  }
}

module.exports = ScenarioLineController;
