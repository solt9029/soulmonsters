import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition } from 'src/graphql/index';
import { handleChangeBattlePositionAction } from './changeBattlePosition';

describe('handleChangeBattlePositionAction', () => {
  it('should change ATTACK position gameCard to DEFENCE position', () => {
    const gameCard = new GameCardModel({
      id: 1,
      battlePosition: BattlePosition.ATTACK,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const result = handleChangeBattlePositionAction({ gameCard }, gameModel);

    expect(result.gameCards[0]?.battlePosition).toBe(BattlePosition.DEFENCE);
  });

  it('should change DEFENCE position gameCard to ATTACK position', () => {
    const gameCard = new GameCardModel({
      id: 1,
      battlePosition: BattlePosition.DEFENCE,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const result = handleChangeBattlePositionAction({ gameCard }, gameModel);

    expect(result.gameCards[0]?.battlePosition).toBe(BattlePosition.ATTACK);
  });
});
