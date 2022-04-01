const ThemeController = require('../controllers/ThemeController');

module.exports = app => {
    app.route('/themes')
        .get(ThemeController.readAll)
        .post(ThemeController.create)

    app.route('/themes/id/:id')
        .get(ThemeController.readOne)

    app.route('/themes/lastUpdate')
        .get(ThemeController.lastUpdate)
}