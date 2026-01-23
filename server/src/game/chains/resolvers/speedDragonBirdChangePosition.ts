import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition } from 'src/graphql/index';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveSpeedDragonBirdChangePosition = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const { targetGameCard } = gameChainLink.effect.payload;

  if (!targetGameCard) {
    return gameModel;
  }

  const newBattlePosition =
    targetGameCard.battlePosition === BattlePosition.ATTACK ? BattlePosition.DEFENCE : BattlePosition.ATTACK;

  gameModel.gameCards = gameModel.gameCards.map(card =>
    card.id === targetGameCard.id
      ? new GameCardModel({
          ...card,
          battlePosition: newBattlePosition,
        })
      : card,
  );

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
