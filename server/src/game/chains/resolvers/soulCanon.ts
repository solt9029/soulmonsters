import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { moveGameCardToMorgue } from 'src/game/mutations/moveGameCardToMorgue';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';

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
  gameModel = addGameLog(gameModel, `ソウルキャノンの効果を処理し、${targetGameCard.card.name}を破壊しました。`);

  return gameModel;
};
