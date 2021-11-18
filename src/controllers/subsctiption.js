import * as subscriptionService from '../services/subscription';

export async function getPlans(req, res) {
  const plans = await subscriptionService.getPlans();
  return res.send(plans).status(200);
}

export async function getDaysFromPlan(req, res) {
  const { planId } = req.params;
  const days = await subscriptionService.getDaysFromPlan(planId);
  return res.send(days).status(200);
}

export async function getProducts(req, res) {
  const products = await subscriptionService.getProducts();
  return res.send(products).status(200);
}
