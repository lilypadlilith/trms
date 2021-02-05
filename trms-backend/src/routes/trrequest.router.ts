import express from 'express';
import logger from '../log';
import requestService from '../dynamodb/trrequest.service';

const router = express.Router();

// Used by frontend "getMyRequests"
router.get('/:username', (req: any, res: any, next: Function) => {
  logger.debug(req.params.username);
  requestService.getRequestsByUser(req.params.username).then((requests)=> {
      logger.debug(requests);
      res.send(JSON.stringify(requests));
  }).catch((err) => {
      logger.error(err);
      res.sendStatus(500);
  })
});

// Used by frontend "getReviewRequests"
router.get('/:username/review', (req: any, res: any, next: Function) => {
  logger.debug(req.params.username);
  requestService.getReviewRequestsByUser(req.params.username).then((requests)=> {
      logger.debug(requests);
      res.send(JSON.stringify(requests));
  }).catch((err) => {
      logger.error(err);
      res.sendStatus(500);
  })
});

// Used by frontend "putRequest"
router.post('/', (req: any, res: any, next: Function) => {
  logger.debug(req.body);
  requestService.putRequest(req.body).then((data)=> {
      logger.debug(data);
      res.sendStatus(201); // Created
  }).catch((err) => {
      logger.error(err);
      res.sendStatus(500); // Server error, sorry
  })
});

export default router;
