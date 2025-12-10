import { GameCard } from '../graphql';
import { GameCardEntity } from '../entities/game.card.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameCardPresenter {
  static present(entity: GameCardEntity): GameCard {
    return {
      id: entity.id,
      originalUserId: entity.originalUserId,
      currentUserId: entity.currentUserId,
      zone: entity.zone,
      position: entity.position,
      battlePosition: entity.battlePosition,
      name: entity.name,
      kind: entity.kind,
      type: entity.type,
      attribute: entity.attribute,
      attack: entity.attack,
      defence: entity.defence,
      cost: entity.cost,
      detail: entity.detail,
      card: entity.card,
      actionTypes: entity.actionTypes,
    };
  }
}
