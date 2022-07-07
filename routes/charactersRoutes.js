const CharacterController = require("../controllers/CharacterController");

module.exports = (app) => {
  app
    .route("/characters")
    .get(CharacterController.readAll)
    .post(CharacterController.create);

  app.route("/characters/id/:id").get(CharacterController.readOne);

  app.route("/characters/lastUpdate").get(CharacterController.lastUpdate);
};
