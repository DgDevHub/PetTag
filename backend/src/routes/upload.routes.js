import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = Router();

// Helper para upload de buffer para Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// Upload de foto do pet para Cloudinary
router.post('/upload/pet', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'qrau/pets');

        return res.status(200).json({
            message: 'Imagem enviada com sucesso!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
});

// Upload de imagem customizada para QR Code para Cloudinary
router.post('/upload/qrcode', authMiddleware, upload.single('background'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'qrau/qrcodes');

        return res.status(200).json({
            message: 'Imagem enviada com sucesso!',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
});

export default router;
