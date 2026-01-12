import { GameChainLinkModel } from './game-chain-link.model';

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
  gameChainLinks: GameChainLinkModel[];
  createdAt: Date;
  updatedAt: Date;
}
