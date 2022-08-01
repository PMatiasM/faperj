const ScenarioOutcomeController = require("../controllers/ScenarioOutcomeController");

module.exports = (app) => {
  app
    .route("/scenario")
    .get(ScenarioOutcomeController.readAll)
    .post(ScenarioOutcomeController.create);

  app.route("/scenario/id/:id").get(ScenarioOutcomeController.readOne);

  app.route("/scenario/lastUpdate").get(ScenarioOutcomeController.lastUpdate);
};
