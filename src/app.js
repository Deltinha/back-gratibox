import './setup.js';
import express from 'express';
import cors from 'cors';

import * as subscriptionController from './controllers/subsctiption';
import * as userController from './controllers/user';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.sendStatus(200));

app.post('/register', userController.postNewUser);

app.get('/plans', subscriptionController.getPlans);

app.get('/plans/:planId', subscriptionController.getDaysFromPlan);

app.get('/products', subscriptionController.getProducts);

app.get('/states', subscriptionController.getStates);

app.post('/subscriptions', subscriptionController.postSubscription);

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  console.log({ error, request, response });
  return response.sendStatus(500);
});

export default app;
