import * as userRepository from '../repositories/user';
import validateBearerToken from '../schemas/authorizationScema';

export async function checkUserLoggedIn(token) {
  const session = await userRepository.getSession(token);
  if (session.length === 0) return false;
  return session[0];
}

export async function checkIsAuthValid(bearerToken) {
  if (bearerToken === undefined) return false;
  const isAuthValid = validateBearerToken(bearerToken);
  return isAuthValid;
}
