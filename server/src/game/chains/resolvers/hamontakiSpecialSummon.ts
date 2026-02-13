import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType, Kind, Type, Zone } from 'src/graphql/index';
import { moveGameCardToBattle } from 'src/game/mutations/moveGameCardToBattle';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

const MONSTER_KINDS: Kind[] = [Kind.MONSTER, Kind.CIRCLE_MONSTER];

function hasEligibleTargetInMorgue(gameModel: GameModel, userId: string): boolean {
  return gameModel.gameCards.some(
    gc =>
      gc.currentUserId === userId &&
      gc.zone === Zone.MORGUE &&
      gc.card != null &&
      MONSTER_KINDS.includes(gc.card.kind) &&
      gc.card.type === Type.RECTANGLE,
  );
}

export const resolveHamontakiSpecialSummon = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  if (gameChainLink.effect.type !== EffectType.HAMONTAKI_SPECIAL_SUMMON) {
    return gameModel;
  }

  if (!hasEligibleTargetInMorgue(gameModel, gameChainLink.userId)) {
    return markGameChainLinkAsResolved(gameModel, gameChainLink);
  }

  if (gameChainLink.effect.targetGameCardId === undefined) {
    return gameModel;
  }

  gameModel = moveGameCardToBattle(gameModel, gameChainLink.userId, gameChainLink.effect.targetGameCardId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
