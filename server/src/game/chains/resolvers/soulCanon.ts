import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { moveGameCardToMorgue } from 'src/game/mutations/moveGameCardToMorgue';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

const getTargetGameCard = (gameModel: GameModel, gameChainLink: GameChainLinkModel) => {
  const targetGameCardId = gameChainLink.effect.type === EffectType.SOUL_CANON && gameChainLink.effect.targetGameCardId;

  return gameModel.gameCards.find(gameCard => gameCard.id === targetGameCardId);
};

export const resolveSoulCanon = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  const targetGameCard = getTargetGameCard(gameModel, gameChainLink);

  if (!targetGameCard) {
    return gameModel;
  }

  gameModel = moveGameCardToMorgue(gameModel, targetGameCard);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
