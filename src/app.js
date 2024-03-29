const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { router } = require('./routes/router');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use(router.contractRouter);

Object.keys(router).forEach((key) => {
  app.use(router[key]);
});

module.exports = app;
