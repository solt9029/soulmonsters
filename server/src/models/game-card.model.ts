import { GameCardEntity } from '../entities/game-card.entity';
import { Zone, BattlePosition, ActionType, Kind, Type, Attribute } from '../graphql/index';
import { CardModel } from './card.model';
import { GameCardToEntityMapper } from '../mappers/to-entity/game-card.to-entity.mapper';
import { CardToEntityMapper } from '../mappers/to-entity/card.to-entity.mapper';

export class GameCardModel {
  constructor(partial?: Partial<GameCardModel>) {
    Object.assign(this, partial);
    this.actionTypes = this.actionTypes || [];
  }

  id: number;
  originalUserId: string;
  currentUserId: string;
  zone: Zone;
  position: number;
  battlePosition: BattlePosition;
  createdAt: Date;
  updatedAt: Date;
  card: CardModel;
  actionTypes: ActionType[];
  name?: string | null;
  kind?: Kind | null;
  type?: Type | null;
  attribute?: Attribute | null;
  attack?: number | null;
  defence?: number | null;
  cost?: number | null;
  detail?: string | null;
}
