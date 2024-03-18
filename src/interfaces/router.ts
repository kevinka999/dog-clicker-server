import { Router } from "express"
import { LoginController } from "./controllers"
import container from "../infra/container"

console.log("[router] starting routes")
const router = Router()
router.post("/login", (req, res) =>
  new LoginController(container.get("loginUsecase")).execute(req, res),
)

export default router
