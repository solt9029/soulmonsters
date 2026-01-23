import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { drawCardFromDeck } from 'src/game/utils/drawCardFromDeck';
import { saveEffectUseCountGameState } from 'src/game/chains/resolvers/ruteruteDraw/saveEffectUseCountGameState';
import { markGameChainLinkAsResolved } from 'src/game/utils/markGameChainLinkAsResolved';

export const resolveRuteruteDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = saveEffectUseCountGameState(gameModel, gameCard);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
