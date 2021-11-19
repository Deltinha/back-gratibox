import * as userService from '../services/user';
import * as subscriptionService from '../services/subscription';

export async function postNewUser(req, res) {
  const userInfo = req.body;

  const isEmailTaken = await userService.checkEmailExists(userInfo.email);
  if (isEmailTaken) return res.sendStatus(403);

  const isSyntaxValid = userService.checkNewUserSyntax(userInfo);
  if (!isSyntaxValid) return res.sendStatus(400);

  await userService.insertUser(userInfo);
  return res.sendStatus(201);
}

export async function login(req, res) {
  const loginInfo = req.body;

  const isSyntaxValid = userService.checkLoginSyntax(loginInfo);
  if (!isSyntaxValid) return res.sendStatus(400);

  const userExists = await userService.checkEmailExists(loginInfo.email);
  if (!userExists) return res.sendStatus(403);

  const session = await userService.login(loginInfo);
  if (!session) return res.sendStatus(403);

  return res.send(session).status(200);
}

export async function getPlanFromUser(req, res) {
  const auth = req.headers.authorization;

  const isAuthValid = await userService.checkIsAuthValid(auth);
  if (!isAuthValid) return res.sendStatus(401);

  const token = auth.replace('Bearer ', '');

  const isUserLoggedIn = await userService.checkUserLoggedIn(token);
  if (!isUserLoggedIn) return res.sendStatus(401);

  const userId = isUserLoggedIn.user_id;

  const plan = await userService.getPlanFromUser(userId);

  const choosenPlan = plan.plan;
  const choosenDay = plan.day;

  const nextDeliveries = await subscriptionService.getNextDeliveries({
    choosenPlan,
    choosenDay,
  });

  return res.send({ ...plan, nextDeliveries }).status(200);
}
