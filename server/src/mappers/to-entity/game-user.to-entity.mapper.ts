import { Injectable } from '@nestjs/common';
import { GameUserEntity } from '../../entities/game-user.entity';
import { GameUserModel } from '../../models/game-user.model';
import { DeckToEntityMapper } from './deck.to-entity.mapper';

@Injectable()
export class GameUserToEntityMapper {
  constructor(private readonly deckToEntityMapper: DeckToEntityMapper) {}

  toEntity(model: GameUserModel): GameUserEntity {
    return new GameUserEntity({
      id: model.id,
      userId: model.userId,
      energy: model.energy,
      lifePoint: model.lifePoint,
      lastViewedAt: model.lastViewedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deck: model.deck ? this.deckToEntityMapper.toEntity(model.deck) : undefined,
    });
  }
}
