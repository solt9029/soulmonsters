// TODO: typeormのBaseEntityを継承しておきたい。多分継承すると、メソッドとかがもりもりになる結果、gameEntityを受け取ってgameEntityをimmutableに返すあたりの処理がうまく動かずbuildがエラーになる

export class AppEntity<T = any> {
  constructor(partial?: Partial<T>) {
    Object.assign(this, partial);
  }
}
