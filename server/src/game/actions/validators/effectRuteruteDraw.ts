import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { GameCardEntity } from 'src/entities/game-card.entity';

export type EffectRuteruteDrawActionPayload = {
  gameCard: GameCardEntity;
};

export function validateEffectRuteruteDrawAction(
  data: GameActionDispatchInput,
  game: GameModel,
): EffectRuteruteDrawActionPayload {
  const { gameCardId } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_RUTERUTE_DRAW)) {
    throw new BadRequestException('The specified game card does not have the EFFECT_RUTERUTE_DRAW action type');
  }

  return { gameCard };
}
