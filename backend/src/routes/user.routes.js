// Routes basicamente é as rotas da sua api que chamam os controllers que logo após chamam os services

import { Router } from 'express'
import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser, logoutUser, getCurrentUser } from '../controllers/user.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// Rotas públicas
router.post("/register", createUser) // Rota para criar usuário
router.post("/login", loginUser) // Rota para fazer login

// Rotas protegidas
router.post("/logout", authMiddleware, logoutUser) // Rota para fazer logout
router.get("/me", authMiddleware, getCurrentUser) // Rota para obter usuário atual
router.get("/users", authMiddleware, getUsers) // Rota para listar todos os usuários
router.get("/users/:id", authMiddleware, getUserById) // Rota para obter um usuário por ID
router.put("/users/:id", authMiddleware, updateUser) // Rota para atualizar um usuário por ID
router.delete("/users/:id", authMiddleware, deleteUser) // Rota para deletar um usuário por ID

export default router;