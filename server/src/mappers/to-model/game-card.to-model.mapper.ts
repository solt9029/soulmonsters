import { Injectable } from '@nestjs/common';
import { GameCardEntity } from '../../entities/game-card.entity';
import { GameCardModel } from '../../models/game-card.model';
import { CardToModelMapper } from './card.to-model.mapper';

@Injectable()
export class GameCardToModelMapper {
  constructor(private readonly cardToModelMapper: CardToModelMapper) {}

  toModel(entity: GameCardEntity): GameCardModel {
    return new GameCardModel({
      id: entity.id,
      originalUserId: entity.originalUserId,
      currentUserId: entity.currentUserId,
      zone: entity.zone,
      position: entity.position,
      battlePosition: entity.battlePosition,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      card: entity.card ? this.cardToModelMapper.toModel(entity.card) : undefined,
      actionTypes: [],
      name: entity.name,
      kind: entity.kind,
      type: entity.type,
      attribute: entity.attribute,
      attack: entity.attack,
      defence: entity.defence,
      cost: entity.cost,
      detail: entity.detail,
    });
  }
}
