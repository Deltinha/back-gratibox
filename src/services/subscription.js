import * as subscriptionRepository from '../repositories/subscription';
import validateSubscriptionSyntax from '../schemas/subscriptionSchema';

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

export async function insertSubscription(body) {
  await subscriptionRepository.insertSubscription(body);
}

export async function isSubscriptionValid(body) {
  const isSyntaxValid = validateSubscriptionSyntax(body);
  if (!isSyntaxValid) return false;

  const { deliveryDayId: dayId, productsIds } = body;

  const deliveryDay = await subscriptionRepository.getDayFromId(dayId);
  if (deliveryDay.length === 0) return false;

  const products = await subscriptionRepository.getProductsByMultipleIds(
    productsIds
  );
  if (products.length !== productsIds.length) return false;

  return true;
}
