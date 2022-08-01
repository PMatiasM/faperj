const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class ScenarioController {
  static async create(req, res) {
    const scenario = req.body;
    const query = "INSERT INTO scenario SET ?";

    try {
      const db = await asyncMysql();

      if (scenario.title === "") {
        throw new Error("Column 'title' cannot be null");
      }

      if (scenario.description === "") {
        throw new Error("Column 'description' cannot be null");
      }

      if (scenario.background === "") {
        throw new Error("Column 'background' cannot be null");
      }

      if (scenario.startingLine === "") {
        throw new Error("Column 'startingLine' cannot be null");
      }

      if (scenario.positiveOutcome === "") {
        throw new Error("Column 'positiveOutcome' cannot be null");
      }

      if (scenario.negativeOutcome === "") {
        throw new Error("Column 'negativeOutcome' cannot be null");
      }

      const verifyTitle = await db.query(
        `SELECT * FROM scenario WHERE title='${scenario.title}'`
      );
      if (verifyTitle[0].length > 0) {
        throw new Error(`The title '${scenario.title}' already exists`);
      }

      const values = {
        title: scenario.title,
        description: scenario.description,
        characterList: JSON.stringify(scenario.characterList),
        background: scenario.background,
        startingLine: scenario.startingLine,
        lineList: JSON.stringify(scenario.lineList),
        positiveOutcome: scenario.positiveOutcome,
        negativeOutcome: scenario.negativeOutcome,
      };

      const result = await db.query(query, values);
      const scenarioId = result[0].insertId;
      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: scenarioId,
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
      const query = "SELECT * FROM scenario";

      const results = await db.query(query);
      const scenarios = results[0];

      return res.json(scenarios);
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
      const query = "SELECT * FROM scenario WHERE id=?";

      const results = await db.query(query, id);
      const scenario = results[0][0];

      if (!scenario) {
        throw new Error(`Id ${id} scenario does not exist`);
      }

      return res.json(scenario);
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      } else {
        return res.status(500).json({ "Error message": error.message });
      }
    }
  }

  static async readAllPreview(req, res) {
    try {
      const allScenarios = [];

      const db = await asyncMysql();
      const query = "SELECT * FROM scenario";

      const results = await db.query(query);
      const scenarios = results[0];

      for (const scenario of scenarios) {
        allScenarios.push({
          id: scenario.id,
          title: scenario.title,
          description: scenario.description,
        });
      }

      return res.json({ scenario: allScenarios });
    } catch (error) {
      return res.status(500).json({ "Error message": error.message });
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM scenario";

    lastUpdate(query, res);
  }
}

module.exports = ScenarioController;
