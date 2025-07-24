import { GameEntity } from 'src/entities/game.entity';
import { Phase } from 'src/graphql';

const calcNextGameTurnCount = (gameEntity: GameEntity): number => {
  return gameEntity.turnCount + 1;
};

export const updateGamePhaseAndTurn = (gameEntity: GameEntity): GameEntity => {
  gameEntity.phase = Phase.DRAW;
  gameEntity.turnCount = calcNextGameTurnCount(gameEntity);

  return gameEntity;
};
