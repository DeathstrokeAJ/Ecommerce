import express from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getItems);
router.post('/', authenticateToken, createItem);
router.put('/:id', authenticateToken, updateItem);
router.delete('/:id', authenticateToken, deleteItem);

export default router;