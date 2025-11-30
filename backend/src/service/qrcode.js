import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import sharp from 'sharp';

const prisma = new PrismaClient();

// Função helper para converter hex em rgba
const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Criar QR Code para um pet
export const createQRCode = async (petId, qrCodeData) => {
    const pet = await prisma.pet.findUnique({
        where: { id: petId },
        include: { user: true }
    });

    if (!pet) {
        throw new Error('Pet não encontrado');
    }

    // Verifica se já existe um QR Code para este pet
    const existingQRCode = await prisma.qRCode.findUnique({
        where: { petId }
    });

    if (existingQRCode) {
        throw new Error('Este pet já possui um QR Code');
    }

    return await prisma.qRCode.create({
        data: {
            petId,
            ownerName: qrCodeData.ownerName || pet.user.name,
            ownerPhone: qrCodeData.ownerPhone,
            ownerEmail: qrCodeData.ownerEmail || pet.user.email,
            ownerAddress: qrCodeData.ownerAddress,
            emergencyContact: qrCodeData.emergencyContact,
            emergencyPhone: qrCodeData.emergencyPhone,
            backgroundColor: qrCodeData.backgroundColor || '#ffffff',
            foregroundColor: qrCodeData.foregroundColor || '#000000',
            backgroundOpacity: qrCodeData.backgroundOpacity ?? 1.0,
            customText: qrCodeData.customText,
            customBackground: qrCodeData.customBackground,
            logoUrl: qrCodeData.logoUrl,
            rewardOffered: qrCodeData.rewardOffered || false,
            rewardAmount: qrCodeData.rewardAmount,
            additionalInfo: qrCodeData.additionalInfo,
            textTop: qrCodeData.textTop,
            textBottom: qrCodeData.textBottom,
            textTopColor: qrCodeData.textTopColor || '#000000',
            textBottomColor: qrCodeData.textBottomColor || '#000000',
            textTopSize: qrCodeData.textTopSize || 24,
            textBottomSize: qrCodeData.textBottomSize || 20,
            qrSize: qrCodeData.qrSize || 512,
            borderRadius: qrCodeData.borderRadius || 0,
            padding: qrCodeData.padding || 20
        },
        include: {
            pet: true
        }
    });
};

// Buscar QR Code por ID do pet
export const getQRCodeByPetId = async (petId) => {
    return await prisma.qRCode.findUnique({
        where: { petId },
        include: {
            pet: {
                include: {
                    user: true
                }
            }
        }
    });
};

// Buscar QR Code público (quando alguém escanear)
export const getQRCodePublic = async (qrCodeId) => {
    const qrCode = await prisma.qRCode.findUnique({
        where: { qrCodeId },
        include: {
            pet: {
                include: {
                    user: {
                        select: {
                            name: true,
                            phone: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    if (qrCode) {
        // Incrementa o contador de scans
        await prisma.qRCode.update({
            where: { id: qrCode.id },
            data: {
                scanCount: { increment: 1 },
                lastScanned: new Date()
            }
        });
    }

    return qrCode;
};

// Atualizar QR Code
export const updateQRCode = async (qrCodeId, qrCodeData) => {
    return await prisma.qRCode.update({
        where: { id: qrCodeId },
        data: {
            backgroundColor: qrCodeData.backgroundColor,
            foregroundColor: qrCodeData.foregroundColor,
            backgroundOpacity: qrCodeData.backgroundOpacity,
            customText: qrCodeData.customText,
            customBackground: qrCodeData.customBackground,
            logoUrl: qrCodeData.logoUrl,
            ownerName: qrCodeData.ownerName,
            ownerPhone: qrCodeData.ownerPhone,
            ownerEmail: qrCodeData.ownerEmail,
            ownerAddress: qrCodeData.ownerAddress,
            emergencyContact: qrCodeData.emergencyContact,
            emergencyPhone: qrCodeData.emergencyPhone,
            rewardOffered: qrCodeData.rewardOffered,
            rewardAmount: qrCodeData.rewardAmount,
            isActive: qrCodeData.isActive,
            additionalInfo: qrCodeData.additionalInfo,
            textTop: qrCodeData.textTop,
            textBottom: qrCodeData.textBottom,
            textTopColor: qrCodeData.textTopColor,
            textBottomColor: qrCodeData.textBottomColor,
            textTopSize: qrCodeData.textTopSize,
            textBottomSize: qrCodeData.textBottomSize,
            qrSize: qrCodeData.qrSize,
            borderRadius: qrCodeData.borderRadius,
            padding: qrCodeData.padding
        },
        include: {
            pet: true
        }
    });
};

// Gerar imagem do QR Code
export const generateQRCodeImage = async (qrCodeId, customParams = {}) => {
    const qrCode = await prisma.qRCode.findUnique({
        where: { qrCodeId },
        include: { pet: true }
    });

    if (!qrCode) {
        throw new Error('QR Code não encontrado');
    }

    // URL que será encodada no QR Code
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pet/${qrCode.qrCodeId}`;

    // Define valores com prioridade: customParams > qrCode (banco) > defaults
    const qrSize = customParams.qrSize ? parseInt(customParams.qrSize) : (qrCode.qrSize || 512);
    const padding = customParams.padding ? parseInt(customParams.padding) : (qrCode.padding || 20);
    const borderRadius = customParams.borderRadius ? parseInt(customParams.borderRadius) : (qrCode.borderRadius || 0);
    
    const backgroundColor = customParams.bg ? `#${customParams.bg}` : qrCode.backgroundColor;
    const foregroundColor = customParams.fg ? `#${customParams.fg}` : qrCode.foregroundColor;
    const backgroundOpacity = customParams.opacity ? parseFloat(customParams.opacity) : (qrCode.backgroundOpacity ?? 1);
    
    const textTop = customParams.textTop !== undefined ? customParams.textTop : qrCode.textTop;
    const textBottom = customParams.textBottom !== undefined ? customParams.textBottom : qrCode.textBottom;
    const textTopColor = customParams.textTopColor ? `#${customParams.textTopColor}` : qrCode.textTopColor;
    const textBottomColor = customParams.textBottomColor ? `#${customParams.textBottomColor}` : qrCode.textBottomColor;
    const textTopSize = customParams.textTopSize ? parseInt(customParams.textTopSize) : (qrCode.textTopSize || 24);
    const textBottomSize = customParams.textBottomSize ? parseInt(customParams.textBottomSize) : (qrCode.textBottomSize || 20);
    
    const customBackground = customParams.customBackground !== undefined ? customParams.customBackground : qrCode.customBackground;

    // Converte cor hex para objeto rgba para Sharp
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const bgColorObject = { r, g, b, alpha: backgroundOpacity };

    // Opções do QR Code
    // Se tiver background personalizado ou opacidade < 1, usa transparência no QR Code
    const options = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 1,
        margin: 1,
        color: {
            dark: foregroundColor,
            light: (customBackground || backgroundOpacity < 1) ? '#00000000' : backgroundColor
        },
        width: qrSize
    };

    // Gera o QR Code como buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, options);

    // Se tiver textos personalizados ou background, processa com Sharp
    if (textTop || textBottom || customBackground) {
        const textTopHeight = textTop ? textTopSize + 30 : 0;
        const textBottomHeight = textBottom ? textBottomSize + 30 : 0;

        const totalHeight = qrSize + padding * 2 + textTopHeight + textBottomHeight;
        const totalWidth = qrSize + padding * 2;

        // Cria canvas base
        let composite = [];
        let baseImage;

        // Se tiver background personalizado
        if (customBackground) {
            try {
                // Tenta fazer download da imagem de background
                const axios = (await import('axios')).default;
                const backgroundResponse = await axios.get(customBackground, { 
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                const backgroundBuffer = Buffer.from(backgroundResponse.data);

                // Redimensiona o background para cobrir todo o canvas
                baseImage = sharp(backgroundBuffer)
                    .resize(totalWidth, totalHeight, {
                        fit: 'cover',
                        position: 'center'
                    });
                
                // Adiciona uma camada com a cor de fundo do QR Code por cima do background
                // Mas só se a opacidade for maior que 0
                if (backgroundOpacity > 0) {
                    const bgLayer = await sharp({
                        create: {
                            width: qrSize + padding * 2,
                            height: qrSize + padding * 2,
                            channels: 4,
                            background: bgColorObject
                        }
                    }).png().toBuffer();
                    
                    composite.push({
                        input: bgLayer,
                        top: textTopHeight,
                        left: 0
                    });
                }
                
            } catch (error) {
                console.error('Erro ao carregar background, usando cor sólida:', error.message);
                // Fallback para cor sólida se falhar
                baseImage = sharp({
                    create: {
                        width: totalWidth,
                        height: totalHeight,
                        channels: 4,
                        background: bgColorObject
                    }
                });
            }
        } else {
            baseImage = sharp({
                create: {
                    width: totalWidth,
                    height: totalHeight,
                    channels: 4,
                    background: bgColorObject
                }
            });
        }

        // Adiciona QR Code no centro
        composite.push({
            input: qrCodeBuffer,
            top: textTopHeight + padding,
            left: padding
        });

        // Adiciona textos como SVG
        if (textTop) {
            const textTopSvg = Buffer.from(`
                <svg width="${totalWidth}" height="${textTopHeight}">
                    <text
                        x="50%"
                        y="50%"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        font-family="Arial, sans-serif"
                        font-size="${textTopSize}"
                        font-weight="bold"
                        fill="${textTopColor || '#000000'}"
                    >${textTop}</text>
                </svg>
            `);
            composite.push({
                input: textTopSvg,
                top: 0,
                left: 0
            });
        }

        if (textBottom) {
            const textBottomSvg = Buffer.from(`
                <svg width="${totalWidth}" height="${textBottomHeight}">
                    <text
                        x="50%"
                        y="50%"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        font-family="Arial, sans-serif"
                        font-size="${textBottomSize}"
                        fill="${textBottomColor || '#000000'}"
                    >${textBottom}</text>
                </svg>
            `);
            composite.push({
                input: textBottomSvg,
                top: totalHeight - textBottomHeight,
                left: 0
            });
        }

        // Processa a imagem final
        const compositeImage = await baseImage.composite(composite).png().toBuffer();

        // Aplica border radius se configurado
        if (borderRadius > 0) {
            // Cria uma máscara SVG com cantos arredondados  
            const roundedMask = Buffer.from(`
                <svg width="${totalWidth}" height="${totalHeight}">
                    <defs>
                        <clipPath id="rounded">
                            <rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${borderRadius}" ry="${borderRadius}"/>
                        </clipPath>
                    </defs>
                    <rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="white" clip-path="url(#rounded)"/>
                </svg>
            `);
            
            // Renderiza a máscara SVG como PNG
            const maskBuffer = await sharp(roundedMask)
                .resize(totalWidth, totalHeight)
                .png()
                .toBuffer();
            
            // Aplica a máscara na imagem
            return await sharp(compositeImage)
                .composite([{
                    input: maskBuffer,
                    blend: 'dest-in'
                }])
                .png()
                .toBuffer();
        }

        return compositeImage;
    }

    return qrCodeBuffer;
};

// Registrar scan do QR Code
export const registerQRCodeScan = async (qrCodeId, scanData) => {
    const qrCode = await prisma.qRCode.findUnique({
        where: { qrCodeId }
    });

    if (!qrCode) {
        throw new Error('QR Code não encontrado');
    }

    return await prisma.qRCodeScan.create({
        data: {
            qrCodeId: qrCode.id,
            ipAddress: scanData.ipAddress,
            userAgent: scanData.userAgent,
            location: scanData.location
        }
    });
};

// Deletar QR Code
export const deleteQRCode = async (qrCodeId) => {
    return await prisma.qRCode.delete({
        where: { id: qrCodeId }
    });
};

// Verificar se o usuário é o dono do QR Code
export const isQRCodeOwner = async (qrCodeId, userId) => {
    const qrCode = await prisma.qRCode.findUnique({
        where: { id: qrCodeId },
        include: {
            pet: {
                select: { userId: true }
            }
        }
    });
    
    return qrCode && qrCode.pet.userId === userId;
};
