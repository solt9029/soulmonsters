import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameChainModel } from 'src/models/game-chain.model';
import { EffectType } from 'src/graphql/index';
import { getResolvingGameChain } from 'src/game/selectors/getResolvingGameChain';
import { getResolvingGameChainLink } from 'src/game/selectors/getResolvingGameChainLink';

export type SelectAsHedronTargetActionPayload = {
  targetGameCard: GameCardModel;
};

export function handleSelectAsHedronTarget(
  userId: string,
  payload: SelectAsHedronTargetActionPayload,
  gameModel: GameModel,
): GameModel {
  const resolvingGameChain = getResolvingGameChain(gameModel);
  if (resolvingGameChain === undefined) {
    throw new Error('No resolving game chain found');
  }

  const resolvingGameChainLink = getResolvingGameChainLink(resolvingGameChain);
  if (resolvingGameChainLink === undefined) {
    throw new Error('No resolving game chain link found');
  }

  if (resolvingGameChainLink.effect.type !== EffectType.HEDRON_SPECIAL_SUMMON) {
    throw new Error('Resolving chain link is not HEDRON_SPECIAL_SUMMON');
  }

  const updatedLink = new GameChainLinkModel({
    ...resolvingGameChainLink,
    effect: { type: EffectType.HEDRON_SPECIAL_SUMMON, selectedGameCardId: payload.targetGameCard.id },
  });

  gameModel.gameChains = gameModel.gameChains.map(chain =>
    chain.id === resolvingGameChain.id
      ? new GameChainModel({
          ...chain,
          gameChainLinks: chain.gameChainLinks.map(link =>
            link.id === resolvingGameChainLink.id ? updatedLink : link,
          ),
        })
      : chain,
  );

  return gameModel;
}
