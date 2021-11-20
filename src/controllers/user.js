import * as userService from '../services/user';

export async function postNewUser(req, res) {
  const userInfo = req.body;

  const isEmailTaken = await userService.checkEmailExists(userInfo.email);
  if (isEmailTaken) return res.sendStatus(409);

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
