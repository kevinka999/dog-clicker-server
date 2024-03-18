import { LoginUsecase } from "../application/usecases"
import { DogRepository } from "../infra/repositories"
import mongo from "./mongo"

class Container {
  private dependencies: Map<string, any>

  constructor() {
    this.dependencies = new Map()
  }

  set(dependencyName: string, implementation: any): void {
    this.dependencies.set(dependencyName, implementation)
  }

  get<T>(dependencyName: string): T {
    if (!this.dependencies.has(dependencyName)) {
      throw new Error(`[dependency container] - '${dependencyName}' not found.`)
    }

    return this.dependencies.get(dependencyName) as T
  }
}

console.log("[container] instantiating depedency injection container")
const container = new Container()

container.set("dogRepository", new DogRepository(mongo.mongoDb))
container.set(
  "loginUsecase",
  new LoginUsecase(container.get<DogRepository>("dogRepository")),
)

export default container
