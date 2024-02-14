const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const blogRoute = require('./router/blogRoute');






require('./db');
require('dotenv').config();
const PORT = process.env.PORT;



app.use(bodyParser.json());
app.use(blogRoute);








app.listen(port, () => console.log(`Example app listening on port ${port}!`))