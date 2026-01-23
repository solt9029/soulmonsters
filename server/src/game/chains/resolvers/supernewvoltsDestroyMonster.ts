import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { moveDeckTopCardToMorgue } from './supernewvoltsDestroyMonster/moveDeckTopCardToMorgue';
import { moveTargetMonsterToMorgue } from './supernewvoltsDestroyMonster/moveTargetMonsterToMorgue';
import { saveEffectUseCountGameState } from './supernewvoltsDestroyMonster/saveEffectUseCountGameState';

export const resolveSupernewvoltsDestroyMonster = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  if (!gameChainLink.effect.payload) {
    return gameModel;
  }

  const { gameCard, targetGameCard } = gameChainLink.effect.payload;

  // Perform the effect: deck top to morgue, target monster to morgue, save effect count
  gameModel = moveDeckTopCardToMorgue(gameModel, gameChainLink.userId);
  gameModel = moveTargetMonsterToMorgue(gameModel, targetGameCard);
  gameModel = saveEffectUseCountGameState(gameModel, gameCard);

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
