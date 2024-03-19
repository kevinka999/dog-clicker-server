import { IDogUsecase } from "../../domain/interfaces"

export class LoginController {
  private dogUsecase: IDogUsecase

  constructor(dogUsecase: IDogUsecase) {
    this.dogUsecase = dogUsecase
  }

  public async execute(req, res) {
    const dogIdentifier = req.body.dogIndetifier
    if (!dogIdentifier) return res.status(400).send()

    const dogId = await this.dogUsecase.execute(dogIdentifier)

    return res.send({
      _id: dogId,
    })
  }
}
