import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { moveTargetMonsterToMorgue } from 'src/game/actions/handlers/effectSupernewvoltsDestroyMonster/moveTargetMonsterToMorgue';

export const resolveSupernewvoltsDestroyMonster = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  if (gameChainLink.effect.type !== EffectType.SUPERNEWVOLTS_DESTROY_MONSTER) {
    return gameModel;
  }

  const targetGameCardId = gameChainLink.effect.targetGameCardId;
  const targetGameCard = gameModel.gameCards.find(gameCard => gameCard.id === targetGameCardId);

  if (!targetGameCard) {
    return gameModel;
  }

  gameModel = moveTargetMonsterToMorgue(gameModel, targetGameCard);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
