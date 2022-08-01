const ScenarioOptionController = require("../controllers/ScenarioOptionController");

module.exports = (app) => {
  app
    .route("/scenario")
    .get(ScenarioOptionController.readAll)
    .post(ScenarioOptionController.create);

  app.route("/scenario/id/:id").get(ScenarioOptionController.readOne);

  app.route("/scenario/lastUpdate").get(ScenarioOptionController.lastUpdate);
};
