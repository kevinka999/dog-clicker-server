import express from "express"

const app = express()
const port = 3000

app.use(express.json())

app.post("/login", (req, res) => {
  console.log(req.body)
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`)
})
