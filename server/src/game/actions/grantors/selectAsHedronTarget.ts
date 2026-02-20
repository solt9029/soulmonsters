import { GameModel } from 'src/models/game.model';
import { ActionType, Attribute, EffectType, Kind, Zone } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';
import { getResolvingGameChain } from 'src/game/selectors/getResolvingGameChain';
import { getResolvingGameChainLink } from 'src/game/selectors/getResolvingGameChainLink';

const MONSTER_KINDS: Kind[] = [Kind.MONSTER, Kind.CIRCLE_MONSTER];

export function grantSelectAsHedronTargetAction(gameModel: GameModel, userId: string) {
  const resolvingGameChain = getResolvingGameChain(gameModel);
  if (resolvingGameChain === undefined) {
    return gameModel;
  }

  const resolvingGameChainLink = getResolvingGameChainLink(resolvingGameChain);
  if (resolvingGameChainLink === undefined) {
    return gameModel;
  }

  if (resolvingGameChainLink.effect.type !== EffectType.HEDRON_SPECIAL_SUMMON) {
    return gameModel;
  }

  if (resolvingGameChainLink.effect.selectedGameCardId !== undefined) {
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

    if (!gameCard.card || !MONSTER_KINDS.includes(gameCard.card.kind) || gameCard.card.attribute !== Attribute.PURPLE) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.SELECT_AS_HEDRON_TARGET],
    });
  });

  return gameModel;
}
