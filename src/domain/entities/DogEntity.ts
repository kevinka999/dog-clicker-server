import { ObjectId } from "mongodb"

export class DogEntity {
  public _id: ObjectId
  public identifier: string

  constructor(arg: { _id?: ObjectId; identifier: string }) {
    this._id = arg._id || new ObjectId()
    this.identifier = arg.identifier
  }
}
