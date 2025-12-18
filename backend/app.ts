import express from "express"
import cors from "cors"
import { router as postRouter } from './routes/posts.js'
import { router as authRouter } from './routes/auth.js'
import { router as commentRouter} from "./routes/comments.js"
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
  credentials: true,
}))
app.use(express.json())

app.use('/api/post', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/comment', commentRouter)

app.get('/', (req, res) => {
  res.send('SERVER RUNNING')

})

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})