import { GameModel } from 'src/models/game.model';
import { Phase } from 'src/graphql';
import { updateGamePhaseAndTurn } from './updateGamePhaseAndTurn';

describe('updateGamePhaseAndTurn', () => {
  it('should update phase to DRAW and increment turn count', () => {
    const gameEntity = new GameModel({
      id: 1,
      phase: Phase.END,
      turnCount: 1,
    });

    const result = updateGamePhaseAndTurn(gameEntity);

    expect(result.phase).toBe(Phase.DRAW);
    expect(result.turnCount).toBe(2);
  });
});
