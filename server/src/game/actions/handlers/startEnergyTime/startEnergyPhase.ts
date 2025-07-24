import { GameEntity } from 'src/entities/game.entity';
import { Phase } from 'src/graphql';

export const startEnergyPhase = (gameEntity: GameEntity): GameEntity => {
  gameEntity.phase = Phase.ENERGY;
  return gameEntity;
};
