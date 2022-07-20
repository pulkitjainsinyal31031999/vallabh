const path = require('path');
const express = require('express');
const app = express();

const products = require('./routes/products');
const category = require('./routes/category');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

app.use("/products", products);
app.use("/categories", category);


module.exports = app;