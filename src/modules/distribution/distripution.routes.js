

import { Router } from "express";


import * as distributionController from './distribution.controller.js';


const distributionRouter = Router();


distributionRouter.post('/create', distributionController.create);
distributionRouter.get('/all', distributionController.getAll);


// distributionRouter.get('/:id', distributionController.getById);
// distributionRouter.put('/:id', distributionController.update);
// distributionRouter.delete('/:id', distributionController.deleteDistribution);

export default distributionRouter;