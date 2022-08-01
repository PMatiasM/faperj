const ScenarioOptionController = require("../controllers/ScenarioOptionController");

module.exports = (app) => {
  app
    .route("/scenarioOption")
    .get(ScenarioOptionController.readAll)
    .post(ScenarioOptionController.create);

  app.route("/scenarioOption/id/:id").get(ScenarioOptionController.readOne);

  app
    .route("/scenarioOption/lastUpdate")
    .get(ScenarioOptionController.lastUpdate);
};
