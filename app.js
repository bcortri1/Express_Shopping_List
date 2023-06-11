const express = require('express');
const ExpressError = require("./error.js")

const app = express();
const itemRoutes = require("./itemRoutes.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/items", itemRoutes);


app.use(function (req, res, next) {
    next(new ExpressError("Not Found", 404));
});


app.use(function (err, req, res, next) {

    let status = err.status || 500;
    let message = err.message;


    return res.status(status).json({
        error: { message, status }
    });
});


module.exports = app;