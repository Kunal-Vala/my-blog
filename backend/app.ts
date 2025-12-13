import express from "express"
import {router as postRouter} from './routes/posts'
const app = express()

app.use(express.json())

app.use('/post',postRouter)

app.get('/',(req,res)=>{
    res.send('SERVER RUNNING')

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})