const ScenarioOutcomeController = require("../controllers/ScenarioOutcomeController");

module.exports = (app) => {
  app
    .route("/scenarioOutcome")
    .get(ScenarioOutcomeController.readAll)
    .post(ScenarioOutcomeController.create);

  app.route("/scenarioOutcome/id/:id").get(ScenarioOutcomeController.readOne);

  app
    .route("/scenarioOutcome/lastUpdate")
    .get(ScenarioOutcomeController.lastUpdate);
};
