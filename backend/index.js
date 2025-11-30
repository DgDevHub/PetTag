import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import userRoutes from './src/routes/user.routes.js'
import petRoutes from './src/routes/pet.routes.js'
import qrcodeRoutes from './src/routes/qrcode.routes.js'
import uploadRoutes from './src/routes/upload.routes.js'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CORS_ORIGIN_PROD]
  : [process.env.CORS_ORIGIN_DEV, 'http://localhost:3000', 'http://localhost:3001']

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/users', userRoutes)
app.use('/api', petRoutes)
app.use('/api', qrcodeRoutes)
app.use('/api', uploadRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Rodando em http://localhost:${PORT}`)
})
