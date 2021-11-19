import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as userRepository from '../repositories/user';
import validateBearerToken from '../schemas/authorizationScema';
import * as userSchema from '../schemas/userSchema';

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
  if (user.length === 0) return false;
  return true;
}

export function checkNewUserSyntax(userInfo) {
  const invalidUserInfo = userSchema.validadeNewUserSyntax(userInfo);
  return invalidUserInfo;
}

export function checkLoginSyntax(loginInfo) {
  const invalidLoginInfo = userSchema.validadeLoginSyntax(loginInfo);
  return invalidLoginInfo;
}

export async function insertUser(userInfo) {
  const hashedPass = hashPassword(userInfo.password);
  await userRepository.insertUser({ ...userInfo, hashedPass });
}

function checkPasswordMatch(password, hashedPass) {
  return bcrypt.compareSync(password, hashedPass);
}

function generateToken() {
  const token = uuid();
  return token;
}

export async function login(loginInfo) {
  const { email, password } = loginInfo;
  const userInfo = await userRepository.getUserByEmail(email);
  if (userInfo.length === 0) return false;

  const passwordMatch = checkPasswordMatch(password, userInfo[0].password);
  if (!passwordMatch) return false;

  const token = generateToken();
  const body = { userId: userInfo[0].id, token };
  await userRepository.createSession(body);
  return body;
}
