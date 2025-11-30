import * as qrCodeService from '../service/qrcode.js';
import * as petService from '../service/pet.js';

export const createQRCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { petId } = req.params;
        const qrCodeData = req.body;

        // Verifica se o pet pertence ao usuário
        const isOwner = await petService.isPetOwner(petId, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para criar QR Code para este pet.' });
        }

        const qrCode = await qrCodeService.createQRCode(petId, qrCodeData);

        process.env.NODE_ENV === 'development' && console.log('QR Code criado:', qrCode);

        return res.status(201).json(qrCode);

    } catch (error) {
        console.error('Erro ao criar QR Code:', error.message);
        
        if (error.message === 'Pet não encontrado') {
            return res.status(404).json({ error: error.message });
        }
        
        if (error.message === 'Este pet já possui um QR Code') {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Erro ao criar QR Code, tente novamente.' });
    }
};

export const getQRCodeByPet = async (req, res) => {
    try {
        const userId = req.userId;
        const { petId } = req.params;

        // Verifica se o pet pertence ao usuário
        const isOwner = await petService.isPetOwner(petId, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para acessar este QR Code.' });
        }

        const qrCode = await qrCodeService.getQRCodeByPetId(petId);

        if (!qrCode) {
            return res.status(404).json({ error: 'QR Code não encontrado para este pet.' });
        }

        return res.status(200).json(qrCode);
    } catch (error) {
        console.error('Erro ao buscar QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar QR Code, tente novamente.' });
    }
};

export const updateQRCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const qrCodeData = req.body;

        // Verifica se o QR Code pertence ao usuário
        const isOwner = await qrCodeService.isQRCodeOwner(id, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este QR Code.' });
        }

        const updatedQRCode = await qrCodeService.updateQRCode(id, qrCodeData);

        return res.status(200).json(updatedQRCode);
    } catch (error) {
        console.error('Erro ao atualizar QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar QR Code, tente novamente.' });
    }
};

export const downloadQRCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { qrCodeId } = req.params;

        // Busca o QR Code
        const qrCode = await qrCodeService.getQRCodePublic(qrCodeId);

        if (!qrCode) {
            return res.status(404).json({ error: 'QR Code não encontrado.' });
        }

        // Verifica se o QR Code pertence ao usuário
        if (qrCode.pet.userId !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão para baixar este QR Code.' });
        }

        // Gera a imagem do QR Code
        const qrCodeBuffer = await qrCodeService.generateQRCodeImage(qrCodeId);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="qrcode-${qrCode.pet.name}.png"`);
        
        return res.send(qrCodeBuffer);
    } catch (error) {
        console.error('Erro ao baixar QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao baixar QR Code, tente novamente.' });
    }
};

export const deleteQRCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        // Verifica se o QR Code pertence ao usuário
        const isOwner = await qrCodeService.isQRCodeOwner(id, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este QR Code.' });
        }

        await qrCodeService.deleteQRCode(id);
        return res.status(200).json({ message: 'QR Code deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao deletar QR Code, tente novamente.' });
    }
};

// Rota pública - Visualizar informações do pet quando alguém escanear o QR Code
export const getQRCodePublicInfo = async (req, res) => {
    try {
        const { qrCodeId } = req.params;

        const qrCode = await qrCodeService.getQRCodePublic(qrCodeId);

        if (!qrCode) {
            return res.status(404).json({ error: 'QR Code não encontrado.' });
        }

        if (!qrCode.isActive) {
            return res.status(403).json({ error: 'Este QR Code está desativado.' });
        }

        // Registra o scan
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        await qrCodeService.registerQRCodeScan(qrCodeId, {
            ipAddress,
            userAgent
        });

        return res.status(200).json(qrCode);
    } catch (error) {
        console.error('Erro ao buscar informações do QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar informações, tente novamente.' });
    }
};

// Visualizar imagem do QR Code (sem download)
export const viewQRCode = async (req, res) => {
    try {
        const { qrCodeId } = req.params;
        const customParams = req.query; // Todos os parâmetros customizados para preview

        // Gera a imagem do QR Code com parâmetros opcionais
        const qrCodeBuffer = await qrCodeService.generateQRCodeImage(qrCodeId, customParams);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache'); // Desabilita cache para preview em tempo real
        
        return res.send(qrCodeBuffer);
    } catch (error) {
        console.error('Erro ao visualizar QR Code:', error.message);
        return res.status(500).json({ error: 'Erro ao visualizar QR Code, tente novamente.' });
    }
};
