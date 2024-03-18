import { Db, MongoClient } from "mongodb"

class Mongo {
  public client: MongoClient
  public mongoDb: Db

  public async bootstrap() {
    await this.startServer()
    await this.createIndexes()
  }

  public async close() {
    console.log("[mongo] closing mongodb connection")
    await this.client.close()
  }

  private async startServer() {
    console.log("[mongo] starting server")
    const uri = process.env.MONGO_URI || ""
    const dbName = process.env.DB_NAME || ""
    if (!uri || !dbName) throw new Error("Mongo params not provided")

    this.client = new MongoClient(uri)
    await this.client.connect()
    console.log("[mongo] server connected succesfully")

    this.mongoDb = this.client.db(dbName)
  }

  private async createIndexes() {
    console.log("[mongo] creating collection indexes")
    await this.mongoDb.collection("dogs").createIndex({ dogIndetifier: 1 })
  }
}

const mongo = new Mongo()

export default mongo
