import { Router } from "express"
import { LoginController } from "./controllers"

export class RouterHandler {
  public async generateRouter(): Promise<Router> {
    const container = await (await import("../infra/container")).default

    console.log("[router] starting routes")
    const router = Router()
    router.post("/login", (req, res) =>
      new LoginController(container.get("loginUsecase")).execute(req, res),
    )
    return router
  }
}
