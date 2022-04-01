const PortraitPathController = require('../controllers/PortraitPathController.js');

module.exports = app => {
    app.route('/paths')
        .get(PortraitPathController.readAll)
        .post(PortraitPathController.create)

    app.route('/paths/id/:id')
        .get(PortraitPathController.readOne)
}