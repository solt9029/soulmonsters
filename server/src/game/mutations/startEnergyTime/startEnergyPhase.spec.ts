import { GameModel } from 'src/models/game.model';
import { Phase } from 'src/graphql';
import { startEnergyPhase } from './startEnergyPhase';

describe('startEnergyPhase', () => {
  it('should set game phase to ENERGY', () => {
    const gameEntity = new GameModel({
      id: 1,
      phase: Phase.DRAW,
    });

    const result = startEnergyPhase(gameEntity);

    expect(result.phase).toBe(Phase.ENERGY);
  });
});
