import { Router } from 'express';
import { 
    createQRCode, 
    getQRCodeByPet, 
    updateQRCode, 
    downloadQRCode,
    deleteQRCode,
    getQRCodePublicInfo,
    viewQRCode
} from '../controllers/qrcode.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Rotas públicas
router.get('/qrcode/public/:qrCodeId', getQRCodePublicInfo); // Informações do pet quando escanear
router.get('/qrcode/view/:qrCodeId', viewQRCode); // Visualizar imagem do QR Code

// Rotas protegidas
router.post('/pets/:petId/qrcode', authMiddleware, createQRCode); // Criar QR Code para um pet
router.get('/pets/:petId/qrcode', authMiddleware, getQRCodeByPet); // Buscar QR Code de um pet
router.put('/qrcode/:id', authMiddleware, updateQRCode); // Atualizar QR Code
router.get('/qrcode/download/:qrCodeId', authMiddleware, downloadQRCode); // Baixar QR Code
router.delete('/qrcode/:id', authMiddleware, deleteQRCode); // Deletar QR Code

export default router;
