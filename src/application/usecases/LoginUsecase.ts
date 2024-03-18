import { DogEntity } from "../../domain/entities"
import { IDogRepository } from "../../domain/interfaces/repository/IDogRepository"

export class LoginUsecase {
  private dogRepository: IDogRepository

  constructor(dogRepository: IDogRepository) {
    this.dogRepository = dogRepository
  }

  public async execute(dogIdentifier: string): Promise<string> {
    const dog = await this.dogRepository.findByIdentifier(dogIdentifier)

    if (!dog) {
      const newDog = new DogEntity({ identifier: dogIdentifier })
      const insertedId = await this.dogRepository.create(newDog)
      return insertedId.toString()
    }

    return dog._id.toString()
  }
}
