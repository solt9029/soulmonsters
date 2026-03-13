import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { BattlePosition } from 'src/graphql/index';
import { handleChangeBattlePositionAction } from './changeBattlePosition';

describe('handleChangeBattlePositionAction', () => {
  const card = new CardModel({ id: 1, name: 'テストカード' });

  it('should change ATTACK position gameCard to DEFENCE position', () => {
    const gameCard = new GameCardModel({
      id: 1,
      battlePosition: BattlePosition.ATTACK,
      card,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const result = handleChangeBattlePositionAction('user1', { gameCard }, gameModel);

    expect(result.gameCards[0]?.battlePosition).toBe(BattlePosition.DEFENCE);
  });

  it('should change DEFENCE position gameCard to ATTACK position', () => {
    const gameCard = new GameCardModel({
      id: 1,
      battlePosition: BattlePosition.DEFENCE,
      card,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
    });

    const result = handleChangeBattlePositionAction('user1', { gameCard }, gameModel);

    expect(result.gameCards[0]?.battlePosition).toBe(BattlePosition.ATTACK);
  });
});
