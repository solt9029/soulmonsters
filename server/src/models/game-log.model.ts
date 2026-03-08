export class GameLogModel {
  constructor(partial?: Partial<GameLogModel>) {
    Object.assign(this, partial);
  }

  id: number;
  gameId: number;
  message: string;
  createdAt: Date;
}
