const QuizItemController = require("../controllers/QuizItemController");

module.exports = (app) => {
  app
    .route("/quizItems")
    .get(QuizItemController.readAll)
    .post(QuizItemController.create);

  app.route("/quizItems/id/:id").get(QuizItemController.readOne);

  app.route("/quizItems/lastUpdate").get(QuizItemController.lastUpdate);
};
