import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { drawCardFromDeck } from 'src/game/mutations/drawCardFromDeck';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

export const resolveReitetsunatotiDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(gameModel, `${CARD_NAME.REITETSUNATOTI}の効果を処理し、デッキからカードを2枚ドローしました。`);

  return gameModel;
};
