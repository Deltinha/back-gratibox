import * as userService from '../services/user';

// eslint-disable-next-line import/prefer-default-export
export async function postNewUser(req, res) {
  const userInfo = req.body;

  const isEmailTaken = await userService.checkEmailExists(userInfo.email);
  if (isEmailTaken) return res.sendStatus(403);

  const isSyntaxValid = userService.checkNewUserSyntax(userInfo);
  if (!isSyntaxValid) return res.sendStatus(400);

  await userService.insertUser(userInfo);
  return res.sendStatus(201);
}
