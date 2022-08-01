const ScenarioLineController = require("../controllers/ScenarioLineController");

module.exports = (app) => {
  app
    .route("/scenarioLine")
    .get(ScenarioLineController.readAll)
    .post(ScenarioLineController.create);

  app.route("/scenarioLine/id/:id").get(ScenarioLineController.readOne);

  app.route("/scenarioLine/lastUpdate").get(ScenarioLineController.lastUpdate);
};
