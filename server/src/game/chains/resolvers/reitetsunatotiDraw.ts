import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { drawCardFromDeck } from 'src/game/mutations/drawCardFromDeck';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveReitetsunatotiDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
