import { Injectable } from '@nestjs/common';
import { GameCardEntity } from '../../entities/game-card.entity';
import { GameCardModel } from '../../models/game-card.model';
import { CardToEntityMapper } from './card.to-entity.mapper';

@Injectable()
export class GameCardToEntityMapper {
  constructor(private readonly cardToEntityMapper: CardToEntityMapper) {}

  toEntity(model: GameCardModel): GameCardEntity {
    return new GameCardEntity({
      id: model.id,
      originalUserId: model.originalUserId,
      currentUserId: model.currentUserId,
      zone: model.zone,
      position: model.position,
      battlePosition: model.battlePosition,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      card: model.card ? this.cardToEntityMapper.toEntity(model.card) : undefined,
      name: model.name,
      kind: model.kind,
      type: model.type,
      attribute: model.attribute,
      attack: model.attack,
      defence: model.defence,
      cost: model.cost,
      detail: model.detail,
    });
  }
}
