export interface IDogUsecase {
  execute(dogIdentifier: string): Promise<string>
}
