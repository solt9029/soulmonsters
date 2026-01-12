export enum GameChainStatus {
  BUILDING = 'BUILDING',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
}
export class GameChainModel {
  constructor(partial?: Partial<GameChainModel>) {
    Object.assign(this, partial);
  }

  id: number;
  gameId: number;
  status: GameChainStatus;
  createdAt: Date;
  updatedAt: Date;
}
