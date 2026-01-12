export type GameChainStatus = 'BUILDING' | 'RESOLVING' | 'RESOLVED';

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
