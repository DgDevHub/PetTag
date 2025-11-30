import { Router } from 'express';
import { createPet, getPets, getPetById, updatePet, deletePet } from '../controllers/pet.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas de pets são protegidas
router.post('/pets', authMiddleware, createPet);
router.get('/pets', authMiddleware, getPets);
router.get('/pets/:id', authMiddleware, getPetById);
router.put('/pets/:id', authMiddleware, updatePet);
router.delete('/pets/:id', authMiddleware, deletePet);

export default router;
