import { EffectType } from '../graphql/index';

export enum GameChainLinkStatus {
  WAITING = 'WAITING',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
}

export type Effect =
  | { type: EffectType.RUTERUTE_DRAW }
  | { type: EffectType.NATSUKASHINORUDE_POWER_DOWN; targetGameCardId: number }
  | { type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER; targetGameCardId: number }
  | { type: EffectType.EMERALD_ENERGY_INCREASE };

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
