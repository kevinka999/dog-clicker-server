import "dotenv/config"
import express from "express"
import { createServer } from "node:http"
import { Socket } from "./socket"
import { RouterHandler } from "../presentation/router"
import mongo from "./mongo"
import cors from "cors"

bootstrap()

async function bootstrap() {
  const app = express()
  const server = createServer(app)

  await mongo.bootstrap()

  app.use(express.json())
  app.use(cors())

  const router = await new RouterHandler().generateRouter()
  app.use(router)

  const socket = new Socket(server)
  socket.start()

  server.listen(3000, () => {
    console.log("[server] running at http://127.0.0.1:3000")
  })

  process.on("SIGINT", async () => await disconnect())
  process.on("beforeExit", async () => await disconnect())

  async function disconnect() {
    server.close()
    mongo.close()
    socket.close()
  }
}
