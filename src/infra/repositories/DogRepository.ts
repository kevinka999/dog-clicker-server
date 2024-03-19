import { Collection, Db, ObjectId } from "mongodb"
import { DogEntity } from "../../domain/entities"
import { IDogRepository } from "../../domain/interfaces"

export class DogRepository implements IDogRepository {
  private collection: Collection<DogEntity>

  constructor(mongoDb: Db) {
    this.collection = mongoDb.collection<DogEntity>("dog")
  }

  public async findById(_id: string): Promise<DogEntity | null> {
    return await this.collection.findOne<DogEntity>({ _id: new ObjectId(_id) })
  }

  public async findByIdentifier(
    dogIdentifier: string,
  ): Promise<DogEntity | null> {
    return await this.collection.findOne<DogEntity>({
      identifier: dogIdentifier,
    })
  }

  public async create(dog: DogEntity): Promise<ObjectId> {
    const insertedDog = await this.collection.insertOne(dog)
    return insertedDog.insertedId
  }

  public async updateExp(_id: string, expGained: number): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(_id) },
      { $inc: { exp: expGained } },
    )
  }
}
