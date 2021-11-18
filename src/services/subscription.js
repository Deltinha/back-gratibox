import * as subscriptionRepository from '../repositories/subscriptions';

export async function getPlans() {
  const plans = await subscriptionRepository.getPlans();
  return plans;
}

export async function getDaysFromPlan(planId) {
  const days = await subscriptionRepository.getDaysFromPlan(planId);
  return days;
}

export async function getProducts() {
  const products = await subscriptionRepository.getProducts();
  return products;
}

export async function getStates() {
  const states = await subscriptionRepository.getStates();
  return states;
}
