import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType, Attribute, Kind, Zone } from 'src/graphql/index';
import { moveGameCardToBattle } from 'src/game/mutations/moveGameCardToBattle';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

const MONSTER_KINDS: Kind[] = [Kind.MONSTER, Kind.CIRCLE_MONSTER];

function hasEligibleTargetInMorgue(gameModel: GameModel, userId: string): boolean {
  return gameModel.gameCards.some(
    gc =>
      gc.currentUserId === userId &&
      gc.zone === Zone.MORGUE &&
      gc.card != null &&
      MONSTER_KINDS.includes(gc.card.kind) &&
      gc.card.attribute === Attribute.PURPLE,
  );
}

export const resolveHedronSpecialSummon = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  if (gameChainLink.effect.type !== EffectType.HEDRON_SPECIAL_SUMMON) {
    return gameModel;
  }

  if (!hasEligibleTargetInMorgue(gameModel, gameChainLink.userId)) {
    return markGameChainLinkAsResolved(gameModel, gameChainLink);
  }

  if (gameChainLink.effect.selectedGameCardId === undefined) {
    return gameModel;
  }

  const selectedGameCardId = gameChainLink.effect.selectedGameCardId;
  const summonedGameCard = gameModel.gameCards.find(gc => gc.id === selectedGameCardId);

  gameModel = moveGameCardToBattle(gameModel, gameChainLink.userId, gameChainLink.effect.selectedGameCardId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  if (summonedGameCard) {
    gameModel = addGameLog(
      gameModel,
      `${CARD_NAME.HEDORON}の効果を処理し、${summonedGameCard.card.name}を特殊召喚しました。`,
    );
  }

  return gameModel;
};
