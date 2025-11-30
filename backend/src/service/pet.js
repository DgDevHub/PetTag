import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar um pet
export const createPet = async (userId, petData) => {
    return await prisma.pet.create({
        data: {
            ...petData,
            userId
        },
        include: {
            qrCode: true
        }
    });
};

// Buscar todos os pets de um usuário
export const getPetsByUserId = async (userId) => {
    return await prisma.pet.findMany({
        where: { userId },
        include: {
            qrCode: {
                select: {
                    id: true,
                    qrCodeId: true,
                    isActive: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

// Buscar um pet por ID
export const getPetById = async (petId) => {
    return await prisma.pet.findUnique({
        where: { id: petId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            qrCode: true
        }
    });
};

// Atualizar um pet
export const updatePet = async (petId, petData) => {
    return await prisma.pet.update({
        where: { id: petId },
        data: petData,
        include: {
            qrCode: true
        }
    });
};

// Deletar um pet
export const deletePet = async (petId) => {
    return await prisma.pet.delete({
        where: { id: petId }
    });
};

// Verificar se o pet pertence ao usuário
export const isPetOwner = async (petId, userId) => {
    const pet = await prisma.pet.findUnique({
        where: { id: petId },
        select: { userId: true }
    });
    
    return pet && pet.userId === userId;
};
