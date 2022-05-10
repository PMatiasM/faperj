const QuestionController = require('../controllers/QuestionController');

module.exports = app => {
    app.route('/questions')
        .get(QuestionController.readAll)
        .post(QuestionController.create)
    
    app.route('/questions/id/:id')
        .get(QuestionController.readOne)

    app.route('/questions/lastUpdate')
        .get(QuestionController.lastUpdate)
}