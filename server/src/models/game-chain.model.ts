import { v4 as uuidv4 } from 'uuid';
import { GameChainLinkModel } from './game-chain-link.model';

export enum GameChainStatus {
  BUILDING = 'BUILDING',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
}
export class GameChainModel {
  constructor(partial?: Partial<GameChainModel>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  id: string;
  gameId: number;
  status: GameChainStatus;
  gameChainLinks: GameChainLinkModel[];
  createdAt: Date;
  updatedAt: Date;
}
