import { Router } from 'express';
import { WebappStatCategoryController } from '../../controllers/webapp/app.controller.stat_category'

const statCategoryRouter = Router();

const controller = new WebappStatCategoryController();

statCategoryRouter.get('/create', controller.renderCreateStatCategory);

export { statCategoryRouter }; 