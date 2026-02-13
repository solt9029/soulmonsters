import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { moveGameCardToBattle } from 'src/game/mutations/moveGameCardToBattle';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveHamontakiSpecialSummon = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  if (gameChainLink.effect.type !== EffectType.HAMONTAKI_SPECIAL_SUMMON) {
    return gameModel;
  }

  if (gameChainLink.effect.targetGameCardId === undefined) {
    return gameModel;
  }

  gameModel = moveGameCardToBattle(gameModel, gameChainLink.userId, gameChainLink.effect.targetGameCardId);
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
