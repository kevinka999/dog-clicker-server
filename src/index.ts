import "dotenv/config"
import express from "express"
import { Db, MongoClient } from "mongodb"
import { Server as SocketServer } from "socket.io"
import { createServer } from "node:http"
import cors from "cors"

let client: MongoClient
let db: Db

bootstrap()

async function bootstrap() {
  await configure()

  const app = express()
  const server = createServer(app)
  const socket = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  app.use(express.json())
  app.use(cors())

  app.post("/login", async (req, res) => {
    const dogIdentifier = req.body.dogIndetifier
    console.log(req.body)
    if (!dogIdentifier) return res.status(400).send()

    const dog = await db
      .collection("dog")
      .findOne({ identifier: dogIdentifier })
    if (!dog) {
      const { insertedId } = await db
        .collection("dog")
        .insertOne({ identifier: dogIdentifier })

      return res.send({ _id: insertedId })
    }

    return res.send({
      _id: dog._id,
    })
  })

  socket.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("disconnect", () => {
      console.log("user disconnected")
    })
  })

  server.listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000")
  })

  process.on("SIGINT", async () => await disconnect())
  process.on("beforeExit", async () => await disconnect())

  async function disconnect() {
    server.close()

    if (!client) return
    console.log("Closing mongodb connection..")
    await client.close()
  }
}

async function configure() {
  const uri = process.env.MONGO_URI || ""
  const dbName = process.env.DB_NAME || ""

  client = new MongoClient(uri)
  await client.connect()

  db = client.db(dbName)
  await createIndexes(db)

  async function createIndexes(db: Db) {
    await db.collection("dogs").createIndex({ dogIndetifier: 1 })
  }
}
