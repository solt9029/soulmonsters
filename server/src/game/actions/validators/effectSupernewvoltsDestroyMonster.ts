import { ActionType, GameActionDispatchInput } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectSupernewvoltsDestroyMonsterActionPayload } from 'src/game/actions/handlers/effectSupernewvoltsDestroyMonster';

export function validateEffectSupernewvoltsDestroyMonsterAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectSupernewvoltsDestroyMonsterActionPayload {
  const { gameCardId, targetGameCardIds } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  if (!targetGameCardIds || targetGameCardIds.length !== 1) {
    throw new BadRequestException('Exactly one target game card is required');
  }

  const gameCard = game.gameCards.find(gc => gc.id === gameCardId);
  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER)) {
    throw new BadRequestException(
      'The specified game card does not have the EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER action type',
    );
  }

  const targetGameCardId = targetGameCardIds[0];
  const targetGameCard = game.gameCards.find(gc => gc.id === targetGameCardId);

  if (!targetGameCard) {
    throw new BadRequestException(`Target GameCard with id ${targetGameCardId} not found`);
  }

  return { gameCard, targetGameCard };
}
