import { GameEntity } from '../../../../entities/game.entity';
import { GameStateEntity } from '../../../../entities/game.state.entity';
import { Zone, StateType } from '../../../../graphql';

export const incrementAttackCount = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  const gameCardIndex = gameEntity.gameCards.findIndex(card => card.id === gameCardId);

  if (gameCardIndex === -1) {
    throw new Error('Game card not found');
  }

  const gameCard = gameEntity.gameCards[gameCardIndex];

  // バトルゾーンにあるカードのみ攻撃回数を記録
  if (gameCard.zone !== Zone.BATTLE) {
    return gameEntity;
  }

  if (!gameCard.gameStates) {
    gameCard.gameStates = [];
  }

  const existingAttackCountStateIndex = gameCard.gameStates.findIndex(
    state => state.state.type === StateType.ATTACK_COUNT,
  );

  if (existingAttackCountStateIndex !== -1) {
    gameCard.gameStates[existingAttackCountStateIndex].state = {
      type: StateType.ATTACK_COUNT,
      data: { value: gameCard.gameStates[existingAttackCountStateIndex].state.data['value'] + 1 },
    };
  } else {
    const newGameState = new GameStateEntity();

    newGameState.game = gameEntity;
    newGameState.gameCard = gameCard;
    newGameState.state = { type: StateType.ATTACK_COUNT, data: { value: 1 } };

    gameCard.gameStates.push(newGameState);
  }

  return gameEntity;
};
