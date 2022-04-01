const customExpress = require('./config/customExpress');
require('dotenv/config');

const app = customExpress();

const port = process.env.PORT;

app.listen(port, () => console.log(`API listening on port: ${port}`));