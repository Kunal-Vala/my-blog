import express from "express"
import { router as postRouter } from './routes/posts'
import { router as authRouter } from './routes/auth'
const app = express()

app.use(express.json())

app.use('/post', postRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.send('SERVER RUNNING')

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})