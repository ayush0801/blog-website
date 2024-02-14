const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DB_URL;

mongoose.connect(url)
.then((db) => {
   console.log(`Successfully connected to MongoDB with connection ID: ${db.connection.id}`);
})
.catch((err) => {
   console.log(err);
});