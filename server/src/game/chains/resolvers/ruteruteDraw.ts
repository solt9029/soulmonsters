import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { drawCardFromDeck } from 'src/game/mutations/drawCardFromDeck';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

export const resolveRuteruteDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(
    gameModel,
    `${CARD_NAME.TENKINOKAMIRUTERUTKAI}の効果を処理し、デッキからカードを1枚ドローしました。`,
  );

  return gameModel;
};
