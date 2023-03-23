require('dotenv').config();

const express = require('express');
const Sentry = require('@sentry/node');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  // The request handler must be the first middleware on the app
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: 'development',
  });
  app.use(Sentry.Handlers.requestHandler());
}

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const cars = [
  {
    id: 1,
    name: 'Ford F-150',
  },
  {
    id: 2,
    name: 'Honda Civic',
  },
];

let lastId = 2;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/cars/:carId', (req, res) => {
  const { carId } = req.params;
  const car = cars.find((car) => car.id === parseInt(carId));
  if (!car) {
    res.status(404).send({ error: 'Car not found' });
  }
  res.send(car);
});

app.get('/debug-sentry', (req, res) => {
  throw new Error("My first Sentry error!");
});

app.post('/cars/create', (req, res) => {
  const { name } = req.body;
  const car = {
    id: lastId + 1,
    name,
  };
  cars.push(car);
  lastId += 1;
  res.send(car);
});

if (process.env.NODE_ENV !== 'test') {
  // The request handler must be the first middleware on the app
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}

module.exports = { app };
