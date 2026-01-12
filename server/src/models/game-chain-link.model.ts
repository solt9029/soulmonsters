import { EffectType } from '../graphql/index';

export type GameChainLinkStatus = 'WAITING' | 'RESOLVING' | 'RESOLVED';

export type Effect = {
  type: EffectType.RUTERUTE_DRAW;
};

export class GameChainLinkModel {
  constructor(partial?: Partial<GameChainLinkModel>) {
    Object.assign(this, partial);
  }

  id: number;
  gameChainId: number;
  orderIndex: number;
  userId: string;
  gameCardId: number | null;
  status: GameChainLinkStatus;
  effect: Effect;
  createdAt: Date;
  updatedAt: Date;
}
