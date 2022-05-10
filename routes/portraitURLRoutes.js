const PortraitURLController = require('../controllers/PortraitURLController.js');

module.exports = app => {
    app.route('/paths')
        .get(PortraitURLController.readAll)
        .post(PortraitURLController.create)

    app.route('/paths/id/:id')
        .get(PortraitURLController.readOne)

    app.route('/paths/lastUpdate')
        .get(PortraitURLController.lastUpdate)
}