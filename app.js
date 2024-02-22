const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add this line

const authRoutes = require('./router/authRoute');


require('./db');
require('dotenv').config();
const PORT = process.env.PORT;

const blogRoute = require('./router/blogRoute');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(blogRoute);


app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}!`)
});


app.use(authRoutes);