# 🐾 QRau - Proteja seu Pet com QR Code

Sistema completo para criar QR Codes personalizados para pets, ajudando tutores a encontrarem seus animais caso se percam.

## 🎯 Funcionalidades

- ✅ **Autenticação Completa** - Sistema de login e cadastro com JWT
- ✅ **Gestão de Pets** - Cadastre múltiplos pets com fotos e informações
- ✅ **QR Codes Personalizados** - Crie QR Codes com cores e textos customizados
- ✅ **Página Pública** - Quando alguém escanear o QR, verá as informações do pet
- ✅ **Upload de Imagens** - Faça upload de fotos dos pets
- ✅ **Dashboard Completo** - Gerencie todos os seus pets em um só lugar
- ✅ **Design Responsivo** - Funciona perfeitamente em mobile e desktop

## 🚀 Como Executar

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env (já está configurado)
# DATABASE_URL - Conexão com PostgreSQL
# JWT_SECRET - Chave secreta do JWT
# PORT - Porta do servidor (3000)

# Gerar Prisma Client (já foi gerado)
npx prisma generate

# Aplicar migrations (já foi aplicado)
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### Frontend

```bash
cd frontend

# Instalar dependências (já foram instaladas)
npm install

# Configurar variável de ambiente
# Criar arquivo .env.local com:
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Iniciar aplicação
npm run dev
```

O frontend estará rodando em `http://localhost:3001`

## 📁 Estrutura do Projeto

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── user.js        # Login, Registro, Logout
│   │   ├── pet.js         # CRUD de Pets
│   │   └── qrcode.js      # CRUD e Geração de QR Codes
│   ├── services/
│   │   ├── user.js        # Lógica de negócio de usuários
│   │   ├── pet.js         # Lógica de negócio de pets
│   │   └── qrcode.js      # Lógica de QR Codes
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── pet.routes.js
│   │   ├── qrcode.routes.js
│   │   └── upload.routes.js
│   └── middleware/
│       ├── authMiddleware.js
│       └── uploadMiddleware.js
├── prisma/
│   └── schema.prisma      # Modelos: User, Pet, QRCode, QRCodeScan
├── uploads/               # Pasta de uploads (criada automaticamente)
└── index.js              # Servidor Express
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage
│   │   ├── login/page.tsx         # Página de Login
│   │   ├── register/page.tsx      # Página de Cadastro
│   │   ├── dashboard/page.tsx     # Dashboard (lista de pets)
│   │   ├── pets/
│   │   │   ├── new/               # Cadastrar novo pet
│   │   │   └── [id]/
│   │   │       ├── edit/          # Editar pet
│   │   │       └── qrcode/
│   │   │           ├── create/    # Criar QR Code
│   │   │           └── page.tsx   # Editor de QR Code
│   │   └── pet/
│   │       └── [qrCodeId]/        # Página pública do pet
│   ├── components/
│   │   ├── Loading.tsx            # Componente de loading
│   │   └── ProtectedRoute.tsx     # HOC para rotas protegidas
│   ├── contexts/
│   │   └── AuthContext.tsx        # Context de autenticação
│   └── lib/
│       └── api.ts                 # Configuração do Axios
```

## 🎨 Design

O projeto usa um design fofo e acolhedor com:
- 🎨 Gradientes suaves (laranja, rosa, roxo)
- 🐕 Ícones do Lucide React
- 💫 Animações suaves
- 📱 Totalmente responsivo
- 🍞 Toast notifications (react-hot-toast)

## 📡 API Endpoints

### Autenticação
- `POST /api/users/register` - Cadastrar usuário
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout (protegido)
- `GET /api/users/me` - Dados do usuário atual (protegido)

### Pets
- `GET /api/pets` - Listar pets do usuário (protegido)
- `POST /api/pets` - Criar pet (protegido)
- `GET /api/pets/:id` - Buscar pet (protegido)
- `PUT /api/pets/:id` - Atualizar pet (protegido)
- `DELETE /api/pets/:id` - Deletar pet (protegido)

### QR Codes
- `POST /api/pets/:petId/qrcode` - Criar QR Code (protegido)
- `GET /api/pets/:petId/qrcode` - Buscar QR Code (protegido)
- `PUT /api/qrcode/:id` - Atualizar QR Code (protegido)
- `GET /api/qrcode/download/:qrCodeId` - Baixar QR Code (protegido)
- `GET /api/qrcode/view/:qrCodeId` - Visualizar QR Code (público)
- `GET /api/qrcode/public/:qrCodeId` - Informações públicas do pet (público)

### Upload
- `POST /api/upload/pet` - Upload de foto do pet (protegido)
- `POST /api/upload/qrcode` - Upload de fundo do QR Code (protegido)

## 🗄️ Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. Os modelos são:

### User
- id, name, email, password, phone, timestamps

### Pet
- id, name, species, breed, color, age, weight, photo, medicalInfo, observations
- Relacionamento: pertence a um User

### QRCode
- id, qrCodeId (único), petId
- Customização: backgroundColor, foregroundColor, customText, customBackground, logoUrl
- Contato: ownerName, ownerPhone, ownerEmail, ownerAddress, emergencyContact
- Estatísticas: scanCount, lastScanned, isActive
- Relacionamento: pertence a um Pet

### QRCodeScan
- id, qrCodeId, scannedAt, ipAddress, userAgent, location
- Relacionamento: pertence a um QRCode

## 🔐 Segurança

- Senhas hasheadas com bcrypt
- JWT para autenticação
- Middleware de autenticação
- Validação de propriedade (usuário só pode editar seus próprios pets)
- CORS configurado

## 📦 Dependências Principais

### Backend
- Express
- Prisma
- bcrypt
- jsonwebtoken
- multer
- qrcode
- sharp
- cookie-parser
- cors
- dotenv

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React
- qrcode.react
- js-cookie

## 🎯 Próximos Passos para Completar

As páginas que faltam criar são mais simples, seguindo o mesmo padrão:

1. **Página de Criar/Editar Pet** - Formulário com campos do pet
2. **Página de Criar QR Code** - Formulário com informações de contato
3. **Editor de QR Code** - Canvas com preview e customização
4. **Página Pública do Pet** - Card bonito com informações e botão de contato

Todos os endpoints já estão prontos e funcionando!

## 💡 Como Foi Desenvolvido

Este projeto foi criado pensando na história real de quase perder um cachorro. A ideia é simples:
1. Dono cadastra o pet
2. Cria um QR Code personalizado
3. Imprime e coloca na coleira
4. Se o pet se perder, quem encontrar escaneia e vê os dados de contato

## 🐕 Feito com 💕 para proteger nossos melhores amigos
