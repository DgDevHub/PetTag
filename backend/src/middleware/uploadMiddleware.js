import multer from 'multer';
import path from 'path';

// Configuração do storage em memória (não salva em disco)
// Todas as imagens são enviadas diretamente para o Cloudinary
const storage = multer.memoryStorage();

// Filtro de arquivos (apenas imagens)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'));
    }
};

// Configuração do multer
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: fileFilter
});
