import { GameModel } from 'src/models/game.model';
import { ActionType, EffectType, Kind, Zone } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';
import { getResolvingGameChain } from 'src/game/selectors/getResolvingGameChain';
import { getResolvingGameChainLink } from 'src/game/selectors/getResolvingGameChainLink';

const MONSTER_KINDS: Kind[] = [Kind.MONSTER, Kind.CIRCLE_MONSTER];

export function grantSelectAsHamontakiTargetAction(gameModel: GameModel, userId: string) {
  const resolvingGameChain = getResolvingGameChain(gameModel);
  if (resolvingGameChain === undefined) {
    return gameModel;
  }

  const resolvingGameChainLink = getResolvingGameChainLink(resolvingGameChain);
  if (resolvingGameChainLink === undefined) {
    return gameModel;
  }

  if (resolvingGameChainLink.effect.type !== EffectType.HAMONTAKI_SPECIAL_SUMMON) {
    return gameModel;
  }

  if (resolvingGameChainLink.effect.targetGameCardId !== undefined) {
    return gameModel;
  }

  if (resolvingGameChainLink.userId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    if (gameCard.currentUserId !== userId) {
      return gameCard;
    }

    if (gameCard.zone !== Zone.MORGUE) {
      return gameCard;
    }

    if (!gameCard.card || !MONSTER_KINDS.includes(gameCard.card.kind)) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.SELECT_AS_HAMONTAKI_TARGET],
    });
  });

  return gameModel;
}
