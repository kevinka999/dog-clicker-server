import { Server } from "http"
import { Server as SocketServer } from "socket.io"

interface ClientEvents {
  dogClicked: () => void
}

interface ServerEvents {
  connected: (dogInfo: { name: string }) => void
  newJoin: (nickname: string) => void
  exp: (exp: number, nickname: string) => void
}

interface SocketData {
  dogId: string
  nickname: string
}

export class Socket {
  private socketServer: SocketServer<ClientEvents, ServerEvents, {}, SocketData>

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

  public start() {
    this.bootstrapMiddlewares()
    this.bootstrapEvents()
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

  private bootstrapEvents() {
    console.log("[socket] configuring socket events")
    this.socketServer.on("connection", (socket) => {
      console.log(`${socket.data.nickname} user connected`)
      socket.join(socket.data.dogId)

      socket.on("dogClicked", () => {
        const randomExp = Math.floor(Math.random() * 11)
        this.socketServer
          .to(socket.data.dogId)
          .emit("exp", randomExp, socket.data.nickname)
      })

      socket.emit("connected", { name: "Mocked Doggo" })

      this.socketServer.emit("newJoin", socket.data.nickname)

      socket.on("disconnect", () => {
        console.log("user disconnected")
      })
    })
  }
}
