import { Router } from 'express';
import * as ProductsController from '../controllers/products.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', ProductsController.listAll);
router.post('/', authenticate, ProductsController.createProduct);
router.get('/:id', ProductsController.getById);
router.put('/:id', authenticate, ProductsController.updateProduct);
router.delete('/:id', authenticate, ProductsController.deleteProduct);

export default router;
