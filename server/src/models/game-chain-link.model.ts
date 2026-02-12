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
  | { type: EffectType.EMERALD_ENERGY_INCREASE }
  | { type: EffectType.FRESH_FISH_DRAW }
  | { type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION; targetGameCardId: number }
  | { type: EffectType.SOUL_CANON; targetGameCardId: number }
  | { type: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER }
  | { type: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE }
  | { type: EffectType.AIKAWARAZUYOKUWAKARANAIHANA_DAMAGE }
  | { type: EffectType.NISEKISANCHOU_ENERGY_INCREASE }
  | { type: EffectType.SAIFUKKATSUSHITATAKIBEE_DAMAGE }
  | { type: EffectType.REITETSUNATOTI_DRAW };

export class GameChainLinkModel {
  constructor(partial?: Partial<GameChainLinkModel>) {
    Object.assign(this, partial);
  }

  id: string;
  gameChainId: string;
  orderIndex: number;
  userId: string;
  gameCardId: number | null;
  status: GameChainLinkStatus;
  effect: Effect;
  createdAt: Date;
  updatedAt: Date;
}
