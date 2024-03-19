import { DogEntity } from "../../entities"

export interface IDogEventUsecase {
  generateDogExp(dogId: string): Promise<{
    expGained: number
    totalExp: number
  }>
  getDogInfo(dogId: string): Promise<DogEntity>
}
