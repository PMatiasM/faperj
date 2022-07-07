const CharNameController = require("../controllers/CharNameController.js");

module.exports = (app) => {
  app
    .route("/names")
    .get(CharNameController.readAll)
    .post(CharNameController.create);

  app.route("/names/id/:id").get(CharNameController.readOne);

  app.route("/names/lastUpdate").get(CharNameController.lastUpdate);
};
