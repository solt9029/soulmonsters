import { EffectType } from '../graphql/index';

export class GamePendingEffectModel {
  constructor(partial?: Partial<GamePendingEffectModel>) {
    Object.assign(this, partial);
  }

  id: number;
  gameId: number;
  userId: string;
  gameCardId: number | null;
  effectType: EffectType;
  createdAt: Date;
}
