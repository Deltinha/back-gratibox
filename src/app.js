import './setup.js';
import express from 'express';
import cors from 'cors';

import * as subscriptionController from './controllers/subsctiption';
import connection from './database/database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.sendStatus(200));

app.get('/plans', subscriptionController.getPlans);

app.get('/days/:planId', subscriptionController.getDaysFromPlan);

app.use((error, request, response, next) => {
  console.log({ error, request, response });
  return response.sendStatus(500);
});

export default app;
