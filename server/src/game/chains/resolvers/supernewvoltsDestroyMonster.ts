import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { moveDeckTopCardToMorgue } from 'src/game/actions/handlers/effectSupernewvoltsDestroyMonster/moveDeckTopCardToMorgue';
import { moveTargetMonsterToMorgue } from 'src/game/actions/handlers/effectSupernewvoltsDestroyMonster/moveTargetMonsterToMorgue';
import { saveEffectUseCountGameState } from 'src/game/actions/handlers/effectSupernewvoltsDestroyMonster/saveEffectUseCountGameState';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveSupernewvoltsDestroyMonster = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);

  if (gameChainLink.effect.type !== EffectType.SUPERNEWVOLTS_DESTROY_MONSTER) {
    return gameModel;
  }

  const payload = gameChainLink.effect.payload;

  if (!gameCard || !payload || !payload.targetGameCard) {
    return gameModel;
  }

  // Effect processing: Deck top to morgue + target monster to morgue + effect use count GameState save
  gameModel = moveDeckTopCardToMorgue(gameModel, gameChainLink.userId);
  gameModel = moveTargetMonsterToMorgue(gameModel, payload.targetGameCard);
  gameModel = saveEffectUseCountGameState(gameModel, gameCard);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
