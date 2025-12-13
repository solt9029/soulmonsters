import { Injectable } from '@nestjs/common';
import { GameUserEntity } from '../../entities/game-user.entity';
import { GameUserModel } from '../../models/game-user.model';
import { DeckToModelMapper } from './deck.to-model.mapper';

@Injectable()
export class GameUserToModelMapper {
  constructor(private readonly deckToModelMapper: DeckToModelMapper) {}

  toModel(entity: GameUserEntity): GameUserModel {
    return new GameUserModel({
      id: entity.id,
      userId: entity.userId,
      energy: entity.energy,
      lifePoint: entity.lifePoint,
      lastViewedAt: entity.lastViewedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deck: entity.deck ? this.deckToModelMapper.toModel(entity.deck) : undefined,
      actionTypes: [],
    });
  }
}
