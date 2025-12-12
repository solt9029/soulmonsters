import { GameCard } from '../graphql';
import { GameCardModel } from '../models/game-card.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameCardPresenter {
  present(model: GameCardModel): GameCard {
    return {
      id: model.id,
      originalUserId: model.originalUserId,
      currentUserId: model.currentUserId,
      zone: model.zone,
      position: model.position,
      battlePosition: model.battlePosition,
      name: model.name,
      kind: model.kind,
      type: model.type,
      attribute: model.attribute,
      attack: model.attack,
      defence: model.defence,
      cost: model.cost,
      detail: model.detail,
      card: model.card,
      actionTypes: model.actionTypes,
    };
  }
}
