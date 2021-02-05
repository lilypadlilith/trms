import express from 'express';
import logger from '../log';
import * as user from '../user';

const router = express.Router();

// Used by frontend "getLogin", checks for user in session
router.get('/', function(req: any, res: any, next: Function) {
  if(req.session.user) {
    let user = {...req.session.user};
    res.send(JSON.stringify(user));
  } else {
    res.sendStatus(401);
  }
});

// Used by frontend "login", retrieves user in database
router.post('/', function(req: any, res: any, next: Function) {
  logger.debug('Recieved '+JSON.stringify(req.body));
  user.login(req.body.username, req.body.password).then((user) => {
    if(user === null) {
      res.sendStatus(401);
    }
    req.session.user = user;
    res.send(JSON.stringify(user));
  });
});

// Used by frontend "logout", destroys the session info
router.delete('/', (req: any, res: any, next: Function) => {
  req.session.destroy((err: Error) => logger.error(err));
  res.sendStatus(204);
})

export default router;
