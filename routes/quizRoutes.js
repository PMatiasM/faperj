const QuizController = require("../controllers/QuizController")

module.exports = app => {
    app.route('/quiz')
        .get(QuizController.readAll)
        .post(QuizController.create)
    
    app.route('/quiz/id/:id')
        .get(QuizController.readOne)

    app.route('/quiz/preview')
        .get(QuizController.readAllPreview)

    app.route('/quiz/lastUpdate')
        .get(QuizController.lastUpdate)
}