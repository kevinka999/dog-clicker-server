import { ObjectId } from "mongodb"
import { DogEntity } from "../../entities"

export interface IDogRepository {
  findById(_id: string): Promise<DogEntity | null>
  findByIdentifier(dogIdentifier: string): Promise<DogEntity | null>
  create(dog: DogEntity): Promise<ObjectId>
}
