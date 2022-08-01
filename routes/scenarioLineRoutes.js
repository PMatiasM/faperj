const ScenarioLineController = require("../controllers/ScenarioLineController");

module.exports = (app) => {
  app
    .route("/scenario")
    .get(ScenarioLineController.readAll)
    .post(ScenarioLineController.create);

  app.route("/scenario/id/:id").get(ScenarioLineController.readOne);

  app.route("/scenario/preview").get(ScenarioLineController.readAllPreview);

  app.route("/scenario/lastUpdate").get(ScenarioLineController.lastUpdate);
};
