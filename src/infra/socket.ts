import { Server } from "http"
import { Server as SocketServer } from "socket.io"
import { DogEventHandler } from "../presentation/handlers"

export class Socket {
  private socketServer: SocketServer

  constructor(server: Server) {
    console.log("[socket] starting socket")
    this.socketServer = new SocketServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["dog-identifier", "player-identifier"],
      },
    })
  }

  public async start() {
    const container = await (await import("../infra/container")).default

    this.bootstrapMiddlewares()

    const eventHandler = new DogEventHandler(
      container.get("dogEventUsecase"),
      this.socketServer,
    )
    await eventHandler.handleEvents()
  }

  public close() {
    console.log("[socket] disconnecting sockets from server")
    this.socketServer.disconnectSockets()
    console.log("[socket] closing socket server")
    this.socketServer.close()
  }

  private bootstrapMiddlewares() {
    console.log("[socket] configuring socket middleware")
    this.socketServer.use(async (socket, next) => {
      try {
        const playerNickname = socket.handshake.headers?.["player-identifier"]
        const dogIdentifier = socket.handshake.headers?.["dog-identifier"]

        if (
          !playerNickname ||
          Array.isArray(playerNickname) ||
          !dogIdentifier ||
          Array.isArray(dogIdentifier)
        )
          throw new Error("Wrong data provided")

        socket.data.nickname = playerNickname
        socket.data.dogId = dogIdentifier
        next()
      } catch (e) {
        next(e)
      }
    })
  }
}
