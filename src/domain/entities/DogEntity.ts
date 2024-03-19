import { ObjectId } from "mongodb"

export class DogEntity {
  public _id: ObjectId
  public identifier: string
  public exp?: number

  constructor(arg: { _id?: ObjectId; identifier: string; exp?: number }) {
    this._id = arg._id || new ObjectId()
    this.identifier = arg.identifier
    this.exp = arg.exp || 0
  }
}
