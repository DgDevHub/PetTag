import * as petService from '../service/pet.js';
import cloudinary from '../config/cloudinary.js';

// Função helper para extrair public_id do Cloudinary URL
const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    // URL exemplo: https://res.cloudinary.com/xxx/image/upload/v123456/qrau/pets/abc123.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Pega tudo depois de /upload/, remove extensão
    const pathParts = parts.slice(uploadIndex + 2); // Pula 'upload' e versão
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extensão
    
    return publicId;
};

// Função para deletar imagem do Cloudinary
const deleteCloudinaryImage = async (url) => {
    try {
        const publicId = getCloudinaryPublicId(url);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Imagem deletada do Cloudinary: ${publicId}`);
        }
    } catch (error) {
        console.error('Erro ao deletar imagem do Cloudinary:', error.message);
    }
};

export const createPet = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, species, breed, color, age, weight, photo, medicalInfo, observations } = req.body;

        if (!name || !species) {
            return res.status(400).json({ error: 'Nome e espécie são obrigatórios.' });
        }

        const newPet = await petService.createPet(userId, {
            name,
            species,
            breed,
            color,
            age,
            weight,
            photo,
            medicalInfo,
            observations
        });

        process.env.NODE_ENV === 'development' && console.log('Pet criado:', newPet);

        return res.status(201).json(newPet);

    } catch (error) {
        console.error('Erro ao criar pet:', error.message);
        return res.status(500).json({ error: 'Erro ao criar pet, tente novamente.' });
    }
};

export const getPets = async (req, res) => {
    try {
        const userId = req.userId;
        const pets = await petService.getPetsByUserId(userId);
        return res.status(200).json(pets);
    } catch (error) {
        console.error('Erro ao buscar pets:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar pets, tente novamente.' });
    }
};

export const getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const pet = await petService.getPetById(id);

        if (!pet) {
            return res.status(404).json({ error: 'Pet não encontrado.' });
        }

        // Verifica se o pet pertence ao usuário
        if (pet.userId !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão para acessar este pet.' });
        }

        return res.status(200).json(pet);
    } catch (error) {
        console.error('Erro ao buscar pet:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar pet, tente novamente.' });
    }
};

export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { name, species, breed, color, age, weight, photo, medicalInfo, observations } = req.body;

        // Verifica se o pet pertence ao usuário
        const isOwner = await petService.isPetOwner(id, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este pet.' });
        }

        // Buscar pet atual para pegar a foto antiga
        const currentPet = await petService.getPetById(id);
        
        // Se houver uma nova foto e ela for diferente da antiga, deletar a antiga
        if (photo && currentPet.photo && photo !== currentPet.photo) {
            await deleteCloudinaryImage(currentPet.photo);
        }

        const updatedPet = await petService.updatePet(id, {
            name,
            species,
            breed,
            color,
            age,
            weight,
            photo,
            medicalInfo,
            observations
        });

        return res.status(200).json(updatedPet);
    } catch (error) {
        console.error('Erro ao atualizar pet:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar pet, tente novamente.' });
    }
};

export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Verifica se o pet pertence ao usuário
        const isOwner = await petService.isPetOwner(id, userId);
        if (!isOwner) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este pet.' });
        }

        // Buscar pet para pegar a foto antes de deletar
        const pet = await petService.getPetById(id);
        
        // Deletar a foto do Cloudinary se existir
        if (pet && pet.photo) {
            await deleteCloudinaryImage(pet.photo);
        }

        // Deletar o pet (o Prisma vai deletar o QRCode em cascata)
        await petService.deletePet(id);
        
        return res.status(200).json({ message: 'Pet deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar pet:', error.message);
        return res.status(500).json({ error: 'Erro ao deletar pet, tente novamente.' });
    }
};
