import { GameCardEntity } from '../entities/game-card.entity';
import { GameStateEntity } from '../entities/game-state.entity';
import { CardEntity } from '../entities/card.entity';
import { Zone, BattlePosition, ActionType, Kind, Type, Attribute } from '../graphql/index';
import { CardModel } from './card.model';

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
  gameStates: GameStateEntity[];
  actionTypes: ActionType[];
  name?: string | null;
  kind?: Kind | null;
  type?: Type | null;
  attribute?: Attribute | null;
  attack?: number | null;
  defence?: number | null;
  cost?: number | null;
  detail?: string | null;

  toEntity(): GameCardEntity {
    return new GameCardEntity({
      id: this.id,
      originalUserId: this.originalUserId,
      currentUserId: this.currentUserId,
      zone: this.zone,
      position: this.position,
      battlePosition: this.battlePosition,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      card: new CardEntity({
        id: this.card.id,
        name: this.card.name,
        kind: this.card.kind,
        type: this.card.type,
        attribute: this.card.attribute,
        attack: this.card.attack,
        defence: this.card.defence,
        cost: this.card.cost,
        detail: this.card.detail,
      }),
      gameStates: this.gameStates,
      name: this.name,
      kind: this.kind,
      type: this.type,
      attribute: this.attribute,
      attack: this.attack,
      defence: this.defence,
      cost: this.cost,
      detail: this.detail,
    });
  }
}
