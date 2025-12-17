import express from "express"
import { router as postRouter } from './routes/posts'
import { router as authRouter } from './routes/auth'
import { router as commentRouter} from "./routes/comments"
const app = express()

app.use(express.json())

app.use('/api/post', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/comment', commentRouter)

app.get('/', (req, res) => {
  res.send('SERVER RUNNING')

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})