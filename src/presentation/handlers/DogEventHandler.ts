import { IDogEventUsecase } from "../../domain/interfaces"
import { Server } from "socket.io"

interface ClientEvents {
  dogClicked: () => void
}

interface ServerEvents {
  connected: (dogInfo: { name: string }) => void
  disconnected: (nickname: string) => void
  newJoin: (nickname: string) => void
  exp: (exp: number, nickname: string) => void
}

interface SocketData {
  dogId: string
  nickname: string
}

type SocketServer = Server<ClientEvents, ServerEvents, {}, SocketData>

export class DogEventHandler {
  private dogEventUsecase: IDogEventUsecase
  private socketServer: SocketServer

  constructor(dogEventUsecase: IDogEventUsecase, socketServer: SocketServer) {
    this.dogEventUsecase = dogEventUsecase
    this.socketServer = socketServer
  }

  public async handleEvents() {
    console.log("[socket] configuring socket events")

    this.socketServer.on("connection", (socket) => {
      console.log(`${socket.data.nickname} user connected`)
      socket.join(socket.data.dogId)

      socket.on("dogClicked", async () => {
        const exp = await this.dogEventUsecase.generateDogExp(socket.data.dogId)

        this.socketServer
          .to(socket.data.dogId)
          .emit("exp", exp, socket.data.nickname)
      })

      this.socketServer
        .to(socket.data.dogId)
        .emit("newJoin", socket.data.nickname)

      socket.emit("connected", async () => {
        const dogInfo = await this.dogEventUsecase.getDogInfo(socket.data.dogId)
        return dogInfo
      })

      socket.on("disconnect", () => {
        console.log(`${socket.data.nickname} user disconnected`)
        this.socketServer
          .to(socket.data.dogId)
          .emit("disconnected", socket.data.nickname)
      })
    })
  }
}
