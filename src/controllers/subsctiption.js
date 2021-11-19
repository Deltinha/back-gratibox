import * as subscriptionService from '../services/subscription';
import * as userService from '../services/user';

export async function getPlans(req, res) {
  const plans = await subscriptionService.getPlans();
  return res.send(plans).status(200);
}

export async function getProducts(req, res) {
  const products = await subscriptionService.getProducts();
  return res.send(products).status(200);
}

export async function getStates(req, res) {
  const states = await subscriptionService.getStates();
  return res.send(states).status(200);
}

export async function postSubscription(req, res) {
  const auth = req.headers.authorization;
  const { body } = req;

  const isAuthValid = await userService.checkIsAuthValid(auth);
  if (!isAuthValid) return res.sendStatus(401);

  const isSubscriptionValid = await subscriptionService.isSubscriptionValid(
    body
  );
  if (!isSubscriptionValid) return res.sendStatus(400);

  const token = auth.replace('Bearer ', '');

  const isUserLoggedIn = await userService.checkUserLoggedIn(token);
  if (!isUserLoggedIn) return res.sendStatus(401);

  const userId = isUserLoggedIn.user_id;

  await subscriptionService.insertSubscription({ ...body, userId });
  return res.sendStatus(200);
}

export async function getPlanFromUser(req, res) {
  const auth = req.headers.authorization;

  const isAuthValid = await userService.checkIsAuthValid(auth);
  if (!isAuthValid) return res.sendStatus(401);

  const token = auth.replace('Bearer ', '');

  const isUserLoggedIn = await userService.checkUserLoggedIn(token);
  if (!isUserLoggedIn) return res.sendStatus(401);

  const userId = isUserLoggedIn.user_id;

  const isUserSubscribed = await subscriptionService.isUserSubscribed(userId);
  if (!isUserSubscribed) return res.sendStatus(204);

  const plan = await userService.getPlanFromUser(userId);

  const choosenPlan = plan.plan;
  let choosenDay;
  if (plan.week_day) {
    choosenDay = plan.week_day;
  }
  if (plan.day) {
    choosenDay = plan.day;
  }

  const nextDeliveries = await subscriptionService.getNextDeliveries({
    choosenPlan,
    choosenDay,
  });

  return res.send({ ...plan, nextDeliveries }).status(200);
}
