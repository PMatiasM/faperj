const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class ScenarioOptionController {
  static async create(req, res) {
    const option = req.body;
    const query = "INSERT INTO scenariooption SET ?";

    try {
      const db = await asyncMysql();

      if (option.prompt === "") {
        throw new Error("Column 'prompt' cannot be null");
      }

      const values = {
        prompt: option.prompt,
        nextLine: option.nextLine,
      };

      const result = await db.query(query, values);
      const optionId = result[0].insertId;
      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: optionId,
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
      const query = "SELECT * FROM scenariooption";

      const results = await db.query(query);
      const options = results[0];

      return res.json(options);
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
      const query = "SELECT * FROM scenariooption WHERE id=?";

      const result = await db.query(query, id);
      const option = result[0][0];

      if (!option) {
        throw new Error(`Id ${id} scenariooption does not exist`);
      }

      return res.json(option);
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM scenariooption";

    lastUpdate(query, res);
  }
}

module.exports = ScenarioOptionController;
