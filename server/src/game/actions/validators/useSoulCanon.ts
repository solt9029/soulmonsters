import { ActionType, GameActionDispatchInput, Zone } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { UseSoulCanonActionPayload } from '../handlers/useSoulCanon';

export function validateUseSoulCanonAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): UseSoulCanonActionPayload {
  const { costGameCardIds, targetGameCardIds } = data.payload;

  if (!costGameCardIds || costGameCardIds.length !== 4) {
    throw new BadRequestException('costGameCardIds must contain exactly 4 cards');
  }

  if (!targetGameCardIds || targetGameCardIds.length !== 1) {
    throw new BadRequestException('targetGameCardIds must contain exactly one target');
  }

  const gameUser = game.gameUsers.find(gameUser => gameUser.userId === userId);
  if (!gameUser) {
    throw new BadRequestException(`User with id ${userId} not found in game`);
  }

  if (!gameUser.actionTypes.includes(ActionType.USE_SOUL_CANON)) {
    throw new BadRequestException('User does not have the USE_SOUL_CANON action type');
  }

  // コストが、自分のものであり、ソウルゾーンに置いてあるかどうかを確認する
  const costGameCards = costGameCardIds.map(id => {
    const costGameCard = game.gameCards.find(gameCard => gameCard.id === id);
    if (!costGameCard) {
      throw new BadRequestException(`Cost card with id ${id} not found`);
    }
    if (costGameCard.currentUserId !== userId) {
      throw new BadRequestException(`Cost card ${id} does not belong to the current user`);
    }
    if (costGameCard.zone !== Zone.SOUL) {
      throw new BadRequestException(`Cost card ${id} is not in the SOUL zone`);
    }
    return costGameCard;
  });

  // ターゲットが相手のものであり、バトルゾーンに置いてあるかどうかを確認する
  const targetGameCardId = targetGameCardIds[0];
  const targetGameCard = game.gameCards.find(gameCard => gameCard.id === targetGameCardId);
  if (!targetGameCard) {
    throw new BadRequestException(`Target game card with id ${targetGameCardId} not found`);
  }
  if (targetGameCard.zone !== Zone.BATTLE) {
    throw new BadRequestException('Target game card must be in the BATTLE zone');
  }
  if (targetGameCard.currentUserId === userId) {
    throw new BadRequestException('Cannot target own monster');
  }

  return { costGameCards, targetGameCard };
}
