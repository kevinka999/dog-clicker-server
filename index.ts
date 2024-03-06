import "dotenv/config"
import express from "express"
import { Db, MongoClient } from "mongodb"

let client: MongoClient
let db: Db

bootstrap()

async function bootstrap() {
  await configure()

  const app = express()

  app.use(express.json())

  app.post("/login", async (req, res) => {
    const dogIdentifier = req.body.dogIndetifier
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

  app.listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000")
  })

  process.on("SIGINT", async () => await disconnectMongo())
  process.on("beforeExit", async () => await disconnectMongo())

  async function disconnectMongo() {
    if (!client) return
    console.log("Closing mongodb connection..")
    await client.close()
  }
}

async function configure() {
  const uri = process.env.MONGO_URI || ""
  const dbName = process.env.CLUSTER_NAME || ""

  client = new MongoClient(uri)
  await client.connect()

  db = client.db(dbName)
  await createIndexes(db)

  async function createIndexes(db: Db) {
    await db.collection("dogs").createIndex({ dogIndetifier: 1 })
  }
}
