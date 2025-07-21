import { GameEntity } from '../../../../entities/game.entity';
import { GameStateEntity } from '../../../../entities/game.state.entity';
import { Zone, StateType } from '../../../../graphql';

export const incrementAttackCount = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  const gameCard = gameEntity.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (gameCard === undefined) {
    throw new Error('Game card not found');
  }

  // バトルゾーンにあるカードのみ攻撃回数を記録
  if (gameCard.zone !== Zone.BATTLE) {
    return gameEntity;
  }

  const existingAttackCountStateIndex = gameEntity.gameStates.findIndex(
    state => state.state.type === StateType.ATTACK_COUNT,
  );

  if (existingAttackCountStateIndex >= 0) {
    gameEntity.gameStates[existingAttackCountStateIndex].state = {
      type: StateType.ATTACK_COUNT,
      data: { value: gameEntity.gameStates[existingAttackCountStateIndex].state.data['value'] + 1 },
    };
  } else {
    const newGameState = new GameStateEntity();

    newGameState.game = gameEntity;
    newGameState.gameCard = gameCard;
    newGameState.state = { type: StateType.ATTACK_COUNT, data: { value: 1 } };

    gameEntity.gameStates.push(newGameState);
  }

  return gameEntity;
};
