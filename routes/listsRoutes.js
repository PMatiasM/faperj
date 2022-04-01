const ListController = require('../controllers/ListController');

module.exports = app => {
    app.route('/lists')
        .get(ListController.readAll)
        .post(ListController.create)
    
    app.route('/lists/id/:id')
        .get(ListController.readOne)

    app.route('/lists/preview')
        .get(ListController.readAllPreview)
}