import { createClient, RedisClientType } from "redis"

export class Redis {
  client: RedisClientType

  public async connect() {
    this.client = createClient({
      password: process.env.REDIS_PW,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    })
    this.client.on("error", (err) => console.log("[redis] error ocurred"))
    this.client.on("connect", () => console.log("[redis] connected to server"))
    this.client.on("disconnect", () =>
      console.log("[redis] disconnecting server"),
    )

    await this.client.connect()
  }

  public async disconnect() {
    await this.client.disconnect()
  }
}

const redis = new Redis()

export default redis
