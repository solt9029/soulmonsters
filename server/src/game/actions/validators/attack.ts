import { GameActionDispatchInput, Zone, StateType } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { AttackActionPayload } from '../handlers/attack';

export function validateAttackAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): AttackActionPayload {
  const { targetGameCardIds, targetGameUserIds, gameCardId } = data.payload;

  const hasTargetGameCardId = (targetGameCardIds || []).length === 1 && (targetGameUserIds || []).length === 0;
  const hasTargetGameUserId = (targetGameCardIds || []).length === 0 && (targetGameUserIds || []).length === 1;

  if (gameCardId === undefined || (!hasTargetGameCardId && !hasTargetGameUserId)) {
    throw new BadRequestException('攻撃の処理に失敗しました');
  }

  const gameCard = game.gameCards.find(value => value.id === gameCardId);

  if (!gameCard?.actionTypes?.includes(ActionType.ATTACK) || game.turnUserId !== userId) {
    throw new BadRequestException('攻撃の処理に失敗しました');
  }

  const gameState = game.gameStates.find(
    value =>
      value.state.type === StateType.ATTACK_COUNT && value.gameCardId === gameCard.id && value.state.data.value > 0,
  );

  if (gameState) {
    throw new BadRequestException('既にこのターン中に攻撃済みです');
  }

  if (hasTargetGameUserId) {
    const opponentBattleGameCards = game.gameCards.filter(
      value => value.zone === Zone.BATTLE && value.currentUserId !== userId,
    );

    if (opponentBattleGameCards.length > 0) {
      throw new BadRequestException('相手のバトルゾーンにモンスターが存在します');
    }

    const opponentGameUser = game.gameUsers.find(value => value.userId !== userId);

    if (!opponentGameUser) {
      throw new BadRequestException('Opponent game user not found');
    }

    return {
      type: 'DIRECT_ATTACK',
      attackerCard: gameCard,
      opponentGameUser,
      attackerUserId: userId,
    };
  }

  if (!targetGameCardIds || targetGameCardIds.length === 0) {
    throw new BadRequestException('Target game card IDs not provided');
  }

  const targetGameCard = game.gameCards.find(value => value.id === targetGameCardIds[0]);
  const opponentGameUser = game.gameUsers.find(value => value.userId !== userId);

  if (!targetGameCard) {
    throw new BadRequestException('Target game card not found');
  }

  if (!opponentGameUser) {
    throw new BadRequestException('Opponent game user not found');
  }

  if (targetGameCard.zone !== Zone.BATTLE || targetGameCard.currentUserId !== opponentGameUser.userId) {
    throw new BadRequestException('選択された攻撃対象が相手のバトルゾーンのモンスターではありません');
  }

  return {
    type: 'MONSTER_BATTLE',
    attackerCard: gameCard,
    targetCard: targetGameCard,
    attackerUserId: userId,
    opponentUserId: opponentGameUser.userId,
  };
}
