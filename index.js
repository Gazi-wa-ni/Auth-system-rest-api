const express = require('express');
const router = require('./web/route');
require('dotenv').config()
const app = express();
require('./db/conn');

// set json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`your app is running on port ${PORT}`);
})
