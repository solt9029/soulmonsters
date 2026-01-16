import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { drawCardFromDeck } from 'src/game/utils/drawCardFromDeck';
import { saveEffectUseCountGameState } from 'src/game/actions/handlers/effectRuteruteDraw/saveEffectUseCountGameState';

export const resolveRuteruteDraw = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  gameModel = drawCardFromDeck(gameModel, gameChainLink.userId);
  gameModel = saveEffectUseCountGameState(gameModel, gameCard);

  return gameModel;
};
