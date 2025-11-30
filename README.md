# � PetTag - Proteja seu Pet com QR Codes Inteligentes

Sistema completo e moderno para criar QR Codes personalizados para pets, ajudando tutores a reencontrarem seus animais caso se percam. Com design responsivo, customização avançada e integração com Cloudinary para armazenamento de imagens.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Segurança
- Sistema completo de registro e login com JWT
- Proteção de rotas com middleware de autenticação
- Senhas criptografadas com bcrypt
- Sessões seguras com cookies HttpOnly

### 🐾 Gestão de Pets
- Cadastro ilimitado de pets com informações completas
- Upload de fotos via Cloudinary (gerenciamento automático)
- Edição e exclusão com limpeza automática de imagens antigas
- Campos: nome, espécie, raça, cor, idade, peso, informações médicas

### 🎨 QR Codes Totalmente Personalizáveis
- **Cores**: Escolha cores de fundo, primeiro plano e textos
- **Textos**: Adicione texto superior e inferior customizados
- **Layout**: Ajuste tamanho, padding e bordas arredondadas
- **Background**: Adicione imagens de fundo personalizadas
- **Transparência**: Controle de opacidade do background
- Download em alta qualidade (PNG)

### 📱 Página Pública Responsiva
- Visualização otimizada quando alguém escanear o QR Code
- Exibe foto, informações e dados de contato do tutor
- Design mobile-first com animações suaves
- Botões diretos para ligar ou enviar WhatsApp

### 📊 Dashboard Intuitivo
- Visualize todos os seus pets em um grid responsivo
- Acesso rápido para editar, ver QR Code ou deletar
- Cards com fotos e informações essenciais
- Interface limpa e moderna com ícones Lucide React

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL configurado e rodando
- Conta no Cloudinary (para upload de imagens)

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na raiz do backend com:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pettag"
JWT_SECRET="sua_chave_secreta_super_segura"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Cloudinary (obtenha em https://cloudinary.com)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Gerar Prisma Client
npx prisma generate

# Criar e aplicar migrations no banco de dados
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

✅ Backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# O projeto já está configurado para usar proxy
# Não precisa configurar NEXT_PUBLIC_API_URL
# As chamadas para /api/* são automaticamente redirecionadas para o backend

# Iniciar aplicação Next.js
npm run dev
```

✅ Frontend estará rodando em `http://localhost:3000`

### 3. Acessar o Sistema

1. Abra o navegador em `http://localhost:3000`
2. Crie uma conta na página de registro
3. Faça login
4. Cadastre seu primeiro pet
5. Crie e personalize o QR Code
6. Baixe e imprima para colocar na coleira!

## 📁 Estrutura do Projeto

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/          # Controllers da aplicação
│   │   ├── user.js          # Login, registro, logout, perfil
│   │   ├── pet.js           # CRUD completo de pets + upload Cloudinary
│   │   └── qrcode.js        # CRUD, geração e download de QR Codes
│   │
│   ├── service/             # Lógica de negócio
│   │   ├── user.js          # Validações e operações de usuários
│   │   ├── pet.js           # Operações de pets com Prisma
│   │   └── qrcode.js        # Geração de imagens QR com Sharp
│   │
│   ├── routes/              # Definição das rotas
│   │   ├── user.routes.js   # Rotas de autenticação
│   │   ├── pet.routes.js    # Rotas de pets (protegidas)
│   │   ├── qrcode.routes.js # Rotas de QR Codes
│   │   └── upload.routes.js # Rotas de upload de imagens
│   │
│   ├── middleware/          # Middlewares
│   │   ├── authMiddleware.js    # Verificação de JWT
│   │   └── uploadMiddleware.js  # Multer (memoryStorage)
│   │
│   └── config/
│       └── cloudinary.js    # Configuração do Cloudinary
│
├── prisma/
│   ├── schema.prisma        # Modelos do banco de dados
│   └── migrations/          # Histórico de alterações do DB
│
├── index.js                 # Servidor Express principal
└── package.json
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/                      # App Router do Next.js 16
│   │   ├── page.tsx             # Homepage com Hero Section
│   │   ├── layout.tsx           # Layout global + AuthContext
│   │   ├── globals.css          # Design System completo
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx         # Página de login
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx         # Página de cadastro
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard com lista de pets
│   │   │
│   │   ├── pets/
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Formulário de novo pet
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.tsx # Editar pet existente
│   │   │       └── qrcode/
│   │   │           ├── page.tsx # Lista QR Codes do pet
│   │   │           ├── create/
│   │   │           │   └── page.tsx # Criar novo QR Code
│   │   │           └── edit/
│   │   │               └── page.tsx # Editor de QR Code
│   │   │
│   │   └── pet/
│   │       └── [qrCodeId]/
│   │           └── page.tsx     # Página pública do pet (sem auth)
│   │
│   ├── components/
│   │   ├── Loading.tsx          # Spinner de carregamento
│   │   └── ProtectedRoute.tsx   # HOC para rotas autenticadas
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx      # Context global de autenticação
│   │
│   └── lib/
│       └── api.ts               # Instância do Axios configurada
│
├── public/                      # Arquivos estáticos
├── next.config.ts               # Config do Next.js + Proxy
├── tailwind.config.ts           # Config do Tailwind CSS
└── package.json
```

## 🎨 Design System

O PetTag possui um design system completo e moderno, totalmente responsivo:

### Cores e Temas
- **Gradientes**: Laranja → Rosa → Roxo (degradês suaves)
- **Background**: Tons de cinza neutros (#0f0f0f, #1a1a1a)
- **Acentos**: Laranja (#ff6b35), Rosa (#ff006e), Roxo (#8338ec)
- **Cards**: Glassmorphism com backdrop-blur
- **Borders**: Gradientes sutis para destaque

### Tipografia
- **Font**: Inter (sans-serif moderna)
- **Tamanhos**: Sistema responsivo de 0.875rem a 3rem
- **Pesos**: 400, 500, 600, 700, 800
- **Line Height**: 1.5 para legibilidade

### Componentes
- **Botões**: 3 variantes (primary, secondary, danger)
- **Inputs**: Design consistente com focus states
- **Cards**: Elevação e hover effects
- **Loading**: Spinners e skeletons
- **Toasts**: Notificações com react-hot-toast

### Responsividade
- **Mobile First**: Design pensado para mobile (320px+)
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid**: Sistema flexível de 1 a 4 colunas
- **Espaçamentos**: Padding/margin adaptativos

### Animações
- **Transitions**: 200ms-300ms cubic-bezier suaves
- **Hover**: Scale, shadow e opacity
- **Focus**: Ring com cores do gradiente
- **Loading**: Spin animations

## 📡 API Endpoints

### Autenticação (`/api/users`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/register` | ❌ Não | Cadastrar novo usuário |
| POST | `/login` | ❌ Não | Login com email e senha |
| POST | `/logout` | ✅ Sim | Fazer logout (limpa token) |
| GET | `/me` | ✅ Sim | Buscar dados do usuário logado |

### Pets (`/api/pets`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | `/` | ✅ Sim | Listar todos os pets do usuário |
| POST | `/` | ✅ Sim | Criar novo pet (com foto) |
| GET | `/:id` | ✅ Sim | Buscar pet específico |
| PUT | `/:id` | ✅ Sim | Atualizar pet (deleta foto antiga no Cloudinary) |
| DELETE | `/:id` | ✅ Sim | Deletar pet (deleta foto no Cloudinary) |

### QR Codes (`/api/qrcode`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/pets/:petId/qrcode` | ✅ Sim | Criar QR Code para um pet |
| GET | `/pets/:petId/qrcode` | ✅ Sim | Buscar QR Code de um pet |
| PUT | `/:id` | ✅ Sim | Atualizar customização do QR Code |
| GET | `/download/:qrCodeId` | ✅ Sim | Baixar imagem PNG do QR Code |
| GET | `/view/:qrCodeId` | ❌ Não | Visualizar QR Code (público) |
| GET | `/public/:qrCodeId` | ❌ Não | Dados públicos do pet (para escaneamento) |

### Upload (`/api/upload`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/pet` | ✅ Sim | Upload de foto do pet para Cloudinary |
| POST | `/qrcode` | ✅ Sim | Upload de imagem de fundo do QR Code |

**Autenticação:** Todas as rotas protegidas requerem o header `Authorization: Bearer <token>`

## 🗄️ Banco de Dados (Prisma + PostgreSQL)

### Diagrama de Relacionamentos

```
User (1) ────── (N) Pet (1) ────── (1) QRCode (1) ────── (N) QRCodeScan
```

### Modelo User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   // Hash bcrypt
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  pets      Pet[]    // Relação 1:N
}
```

### Modelo Pet
```prisma
model Pet {
  id           Int       @id @default(autoincrement())
  name         String
  species      String    // "Cachorro", "Gato", etc
  breed        String?   // Raça
  color        String?
  age          String?   // "3 anos", "5 meses"
  weight       String?   // "15kg", "3kg"
  photo        String?   // URL do Cloudinary
  medicalInfo  String?   // Informações médicas
  observations String?   // Observações gerais
  userId       Int
  user         User      @relation(fields: [userId], references: [id])
  qrCode       QRCode?   // Relação 1:1
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

### Modelo QRCode
```prisma
model QRCode {
  id               Int           @id @default(autoincrement())
  qrCodeId         String        @unique @default(uuid())
  petId            Int           @unique
  pet              Pet           @relation(fields: [petId], references: [id])
  
  // Customização Visual
  backgroundColor  String        @default("#ffffff")
  foregroundColor  String        @default("#000000")
  textTop          String?       // Texto superior
  textBottom       String?       // Texto inferior
  textTopColor     String        @default("#000000")
  textBottomColor  String        @default("#000000")
  textTopSize      Int           @default(32)
  textBottomSize   Int           @default(24)
  customBackground String?       // URL da imagem de fundo
  backgroundOpacity Float        @default(1.0)
  qrSize           Int           @default(300)
  borderRadius     Int           @default(0)
  padding          Int           @default(20)
  
  // Informações de Contato
  ownerName        String
  ownerPhone       String
  ownerEmail       String?
  ownerAddress     String?
  emergencyContact String?
  
  // Estatísticas
  scanCount        Int           @default(0)
  lastScanned      DateTime?
  isActive         Boolean       @default(true)
  scans            QRCodeScan[]  // Relação 1:N
  
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}
```

### Modelo QRCodeScan
```prisma
model QRCodeScan {
  id         Int      @id @default(autoincrement())
  qrCodeId   String
  qrCode     QRCode   @relation(fields: [qrCodeId], references: [qrCodeId])
  scannedAt  DateTime @default(now())
  ipAddress  String?
  userAgent  String?
  location   String?  // Coordenadas GPS (futuro)
}
```

## 🔐 Segurança e Boas Práticas

### Autenticação
- ✅ JWT com expiração configurável
- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ Tokens armazenados em cookies HttpOnly
- ✅ Middleware de autenticação em todas as rotas protegidas

### Autorização
- ✅ Validação de propriedade (usuário só edita seus próprios pets)
- ✅ Verificação de relacionamentos (pet pertence ao usuário)
- ✅ Proteção contra acesso não autorizado

### Validação
- ✅ Validação de campos obrigatórios
- ✅ Sanitização de inputs
- ✅ Verificação de tipos de dados
- ✅ Tratamento de erros centralizado

### Upload de Arquivos
- ✅ Validação de tipos permitidos (JPEG, PNG, WebP)
- ✅ Limite de tamanho configurável
- ✅ Armazenamento direto no Cloudinary (memoryStorage)
- ✅ Limpeza automática de arquivos antigos no Cloudinary
- ✅ Sem armazenamento local (uploads direto para nuvem)

### CORS
- ✅ Configuração específica para frontend (localhost:3000)
- ✅ Credentials habilitados para cookies
- ✅ Headers permitidos: Content-Type, Authorization

### Variáveis de Ambiente
- ✅ Secrets armazenados em `.env` (não versionado)
- ✅ Validação de variáveis essenciais
- ✅ Fallbacks seguros quando aplicável

## 📦 Tecnologias e Dependências

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Express** | 5.1.0 | Framework web para Node.js |
| **Prisma** | 6.16.2 | ORM para PostgreSQL |
| **bcrypt** | 6.0.0 | Hash de senhas |
| **jsonwebtoken** | 9.0.2 | Autenticação JWT |
| **Cloudinary** | 2.8.0 | Armazenamento de imagens na nuvem |
| **Multer** | 1.4.5 | Upload de arquivos multipart |
| **QRCode** | 1.5.4 | Geração de QR Codes |
| **Sharp** | 0.33.6 | Processamento de imagens (composição) |
| **Axios** | 1.13.2 | Cliente HTTP para download de imagens |
| **Cookie-Parser** | 1.4.7 | Parse de cookies |
| **CORS** | 2.8.5 | Configuração de CORS |
| **Dotenv** | 17.2.2 | Gerenciamento de variáveis de ambiente |
| **Nodemon** | 3.1.9 | Hot reload em desenvolvimento |

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 16.0.5 | Framework React com SSR e App Router |
| **React** | 19.2.0 | Biblioteca de UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **Axios** | 1.13.2 | Cliente HTTP para API |
| **Lucide React** | 0.555.0 | Biblioteca de ícones moderna |
| **React Hook Form** | 7.67.0 | Gerenciamento de formulários |
| **React Hot Toast** | 2.6.0 | Notificações toast |
| **QRCode.react** | 4.2.0 | Preview de QR Codes no navegador |
| **js-cookie** | 3.0.5 | Manipulação de cookies |
| **Zod** | 4.1.13 | Validação de schemas |

### DevOps & Ferramentas

- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes
- **PostgreSQL** - Banco de dados relacional
- **Cloudinary** - CDN e armazenamento de imagens
- **VS Code** - Editor recomendado

## 🎯 Funcionalidades Implementadas

### ✅ Concluído

#### Autenticação e Usuários
- [x] Sistema de registro com validação de email único
- [x] Login com JWT e cookies HttpOnly
- [x] Logout com limpeza de sessão
- [x] Middleware de autenticação para rotas protegidas
- [x] Context API para estado global de autenticação

#### Gestão de Pets
- [x] Listar todos os pets do usuário logado
- [x] Cadastrar novo pet com upload de foto
- [x] Editar informações e foto do pet
- [x] Deletar pet (com limpeza automática de imagens)
- [x] Integração com Cloudinary para armazenamento
- [x] Validação de propriedade (segurança)

#### QR Codes
- [x] Criar QR Code único por pet
- [x] Customização completa de cores (fundo, primeiro plano, textos)
- [x] Textos personalizados (superior e inferior)
- [x] Upload de imagem de fundo customizada
- [x] Controle de transparência do background
- [x] Ajustes de layout (tamanho, padding, border radius)
- [x] Preview em tempo real das customizações
- [x] Download em alta qualidade (PNG)
- [x] Geração de imagem com Sharp (composição avançada)

#### Página Pública
- [x] Visualização pública sem necessidade de login
- [x] Exibição de foto, nome e informações do pet
- [x] Dados de contato do tutor
- [x] Botão para ligar direto (tel:)
- [x] Botão para WhatsApp (wa.me)
- [x] Design responsivo e otimizado para mobile
- [x] Contagem de escaneamentos (tracking)

#### Interface e Design
- [x] Design system completo com CSS variables
- [x] Homepage moderna com Hero Section
- [x] Páginas de login e registro responsivas
- [x] Dashboard com grid de cards
- [x] Editor de QR Code com 4 abas (Cores, Textos, Layout, Fundo)
- [x] Componente de Loading reutilizável
- [x] Toast notifications para feedback
- [x] Ícones Lucide React (sem emojis)
- [x] Animações e transições suaves
- [x] Mobile-first design (320px+)

#### Infraestrutura
- [x] Proxy Next.js para evitar CORS
- [x] Variáveis de ambiente configuradas
- [x] Migrations do Prisma versionadas
- [x] Tratamento de erros centralizado
- [x] Logs estruturados no backend

### 🔨 Melhorias Futuras

- [ ] Sistema de recuperação de senha por email
- [ ] Múltiplos QR Codes por pet
- [ ] Estatísticas detalhadas de escaneamentos
- [ ] Mapa de localizações dos scans
- [ ] Notificações quando o QR for escaneado
- [ ] Compartilhamento do QR Code por redes sociais
- [ ] Exportar QR Code em diferentes formatos (SVG, PDF)
- [ ] Temas claro/escuro
- [ ] Internacionalização (i18n)
- [ ] PWA para instalação como app
- [ ] Integração com GPS para tracking de localização
- [ ] Chat entre quem achou e o dono

## � Como Funciona (Fluxo do Usuário)

### 1️⃣ Cadastro e Login
1. Usuário cria uma conta em `/register`
2. Faz login em `/login`
3. JWT é salvo em cookie HttpOnly
4. É redirecionado para o dashboard

### 2️⃣ Cadastrar Pet
1. No dashboard, clica em "Adicionar Pet"
2. Preenche informações (nome, espécie, raça, idade, peso, etc)
3. Faz upload de uma foto do pet
4. Foto é enviada para o Cloudinary
5. Pet é salvo no banco de dados

### 3️⃣ Criar QR Code
1. No card do pet, clica em "Ver QR Code"
2. Preenche informações de contato (nome, telefone, email)
3. É criado um QR Code único vinculado ao pet
4. Acessa o editor para personalizar

### 4️⃣ Personalizar QR Code
1. **Aba Cores**: Escolhe cores de fundo, QR e textos
2. **Aba Textos**: Adiciona texto superior e inferior customizado
3. **Aba Layout**: Ajusta tamanho, padding e cantos arredondados
4. **Aba Fundo**: Adiciona imagem de fundo personalizada
5. Preview em tempo real mostra as mudanças
6. Clica em "Salvar Alterações"

### 5️⃣ Baixar e Usar
1. Clica em "Baixar QR Code" para obter PNG em alta qualidade
2. Imprime o QR Code
3. Cola na coleira do pet ou em uma tag

### 6️⃣ Quando Alguém Escanear
1. Pessoa escaneia o QR Code com o celular
2. É redirecionado para `/pet/[qrCodeId]` (página pública)
3. Vê foto, nome e informações do pet
4. Vê dados de contato do dono
5. Pode ligar diretamente ou enviar WhatsApp
6. Escaneamento é registrado no banco de dados

## 📸 Screenshots

### Dashboard
Grid responsivo com todos os pets cadastrados, cada card mostrando foto e informações básicas.

### Editor de QR Code
Interface com 4 abas para customização completa, preview em tempo real do QR Code personalizado.

### Página Pública
Design mobile-first otimizado para quando alguém escanear o QR Code, com informações claras e botões de ação.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript no frontend
- Siga as convenções do ESLint
- Escreva commits descritivos em português
- Teste suas alterações antes de commitar

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💡 História do Projeto

Este projeto nasceu de uma necessidade real: a angústia de quase perder um pet. 

A ideia é simples mas poderosa: **transformar uma coleira em uma forma inteligente de reencontro**. Com um QR Code personalizado, qualquer pessoa que encontrar um pet perdido pode escanear e ter acesso imediato às informações de contato do dono.

### Por que PetTag?

- 🏃 **Ação Imediata**: Sem cadastros ou apps para instalar
- 📱 **Universal**: Qualquer celular com câmera pode escanear
- 🎨 **Personalização**: Cada QR Code é único e bonito
- 💝 **Gratuito**: Ferramenta acessível para todos os tutores
- 🔒 **Privacidade**: Informações só visíveis ao escanear o QR

### Impacto Social

Milhares de pets se perdem todos os anos. Com o PetTag, aumentamos drasticamente as chances de reencontro. É tecnologia simples fazendo a diferença na vida real de animais e suas famílias.

## 👨‍� Desenvolvedor

Desenvolvido com ❤️ para proteger nossos melhores amigos de quatro patas.

---

**PetTag** - Porque todo pet merece voltar para casa 🏠🐾
