const ScenarioController = require("../controllers/ScenarioController");

module.exports = (app) => {
  app
    .route("/scenario")
    .get(ScenarioController.readAll)
    .post(ScenarioController.create);

  app.route("/scenario/id/:id").get(ScenarioController.readOne);

  app.route("/scenario/preview").get(ScenarioController.readAllPreview);

  app.route("/scenario/lastUpdate").get(ScenarioController.lastUpdate);
};
