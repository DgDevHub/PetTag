import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = Router();

// Upload de foto do pet para Cloudinary
router.post('/upload/pet', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        // Fazer upload para o Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'qrau/pets',
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        });

        // Deletar arquivo temporário do servidor
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            message: 'Imagem enviada com sucesso!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        
        // Deletar arquivo temporário em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
});

// Upload de imagem customizada para QR Code para Cloudinary
router.post('/upload/qrcode', authMiddleware, upload.single('background'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        // Fazer upload para o Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'qrau/qrcodes',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        });

        // Deletar arquivo temporário do servidor
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            message: 'Imagem enviada com sucesso!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        
        // Deletar arquivo temporário em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
});

export default router;
