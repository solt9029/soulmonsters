import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { moveGameCardToMorgue } from 'src/game/mutations/moveGameCardToMorgue';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

const getTargetGameCard = (gameModel: GameModel, gameChainLink: GameChainLinkModel) => {
  const targetGameCardId =
    gameChainLink.effect.type === EffectType.SUPERNEWVOLTS_DESTROY_MONSTER && gameChainLink.effect.targetGameCardId;

  return gameModel.gameCards.find(gameCard => gameCard.id === targetGameCardId);
};

export const resolveSupernewvoltsDestroyMonster = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const targetGameCard = getTargetGameCard(gameModel, gameChainLink);

  if (!targetGameCard) {
    return gameModel;
  }

  gameModel = moveGameCardToMorgue(gameModel, targetGameCard);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(
    gameModel,
    `${CARD_NAME.SUPERNEWVOLTS}の効果を処理し、${targetGameCard.card.name}をモルグゾーンに置きました。`,
  );

  return gameModel;
};
