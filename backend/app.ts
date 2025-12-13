import express from "express"

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('SERVER RUNNING')

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})