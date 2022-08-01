const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class ScenarioOutcomeController {
  static async create(req, res) {
    const outcome = req.body;
    const query = "INSERT INTO scenariooutcome SET ?";

    try {
      const db = await asyncMysql();

      if (outcome.line === "") {
        throw new Error("Column 'line' cannot be null");
      }

      const values = {
        line: outcome.line,
      };

      const result = await db.query(query, values);
      const outcomeId = result[0].insertId;
      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: outcomeId,
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
      const query = "SELECT * FROM scenariooutcome";

      const results = await db.query(query);
      const outcomes = results[0];

      return res.json(outcomes);
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
      const query = "SELECT * FROM scenariooutcome WHERE id=?";

      const result = await db.query(query, id);
      const outcome = result[0][0];

      if (!outcome) {
        throw new Error(`Id ${id} scenariooutcome does not exist`);
      }

      return res.json(outcome);
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM scenariooutcome";

    lastUpdate(query, res);
  }
}

module.exports = ScenarioOutcomeController;
