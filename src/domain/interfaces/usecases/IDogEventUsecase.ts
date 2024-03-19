import { DogEntity } from "../../entities"

export interface IDogEventUsecase {
  generateDogExp(dogId: string): Promise<number>
  getDogInfo(dogId: string): Promise<DogEntity>
}
