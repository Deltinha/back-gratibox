/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as userRepository from '../repositories/user';
import validateBearerToken from '../schemas/authorizationScema';
import validadeNewUserSyntax from '../schemas/userSchema';

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

function hashPassword(password) {
  const hashedPass = bcrypt.hashSync(password, 12);
  return hashedPass;
}

export async function checkEmailExists(email) {
  const user = await userRepository.getUserByEmail(email);
  if (user !== 0) return true;
  return false;
}

export function checkNewUserSyntax(user) {
  const invalidUserInfo = validadeNewUserSyntax(user);
  return invalidUserInfo;
}

function checkPasswordMatch(password, hashedPass) {
  return bcrypt.compareSync(password, hashedPass);
}

function generateToken() {
  const token = uuid();
  return token;
}

export async function insertUser(userInfo) {
  const hashedPass = hashPassword(userInfo.password);
  await userRepository.insertUser({ ...userInfo, hashedPass });
}
