import { IDogEventUsecase, IDogRepository } from "../../domain/interfaces"

export class DogEventUsecase implements IDogEventUsecase {
  private dogRepository: IDogRepository

  constructor(dogRepository: IDogRepository) {
    this.dogRepository = dogRepository
  }

  public async generateDogExp(dogId: string) {
    const randomExp = Math.floor(Math.random() * 11)
    this.dogRepository.updateExp(dogId, randomExp)

    const dogUpdated = await this.dogRepository.findById(dogId)
    if (!dogUpdated) throw new Error("Dog not found")

    return {
      expGained: randomExp,
      totalExp: dogUpdated.exp,
    }
  }

  public async getDogInfo(dogId: string) {
    const dog = await this.dogRepository.findById(dogId)
    if (!dog) throw new Error("Dog not found")
    console.log("dog", dog)
    return dog
  }
}
